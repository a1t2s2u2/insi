import AppKit
import Foundation
import Vision

private func recognize(_ path: String) throws -> [VNRecognizedTextObservation] {
    let url = URL(fileURLWithPath: path)
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["ja-JP", "en-US"]
    request.usesLanguageCorrection = true
    request.minimumTextHeight = 0.008

    let handler = VNImageRequestHandler(url: url, options: [:])
    try handler.perform([request])
    return request.results ?? []
}

let paths = Array(CommandLine.arguments.dropFirst())
guard !paths.isEmpty else {
    FileHandle.standardError.write(Data("usage: swift tools/ocr.swift IMAGE...\n".utf8))
    exit(2)
}

for path in paths {
    print("===== \(path) =====")
    do {
        let observations = try recognize(path).sorted {
            let yDifference = $0.boundingBox.midY - $1.boundingBox.midY
            if abs(yDifference) > 0.01 { return yDifference > 0 }
            return $0.boundingBox.minX < $1.boundingBox.minX
        }
        for observation in observations {
            if let candidate = observation.topCandidates(1).first {
                print(candidate.string)
            }
        }
    } catch {
        FileHandle.standardError.write(Data("OCR failed for \(path): \(error)\n".utf8))
    }
}
