from flask import Flask, request, jsonify, send_from_directory
import requests

app = Flask(__name__)


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(".", filename)


@app.route("/translate", methods=["POST"])
def translate():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No data received."
            }), 400

        text = data.get("text", "").strip()
        source = data.get("source", "").strip()
        target = data.get("target", "").strip()

        if not text:
            return jsonify({
                "error": "Please enter some text."
            }), 400

        if not target:
            return jsonify({
                "error": "Please select a target language."
            }), 400

        url = "https://api.mymemory.translated.net/get"

        params = {
            "q": text,
            "langpair": f"{source}|{target}"
        }

        response = requests.get(
            url,
            params=params,
            timeout=30
        )

        response.raise_for_status()

        result = response.json()

        translation = result.get("responseData", {}).get(
            "translatedText", ""
        )

        if not translation:
            return jsonify({
                "error": "Translation service returned no translation."
            }), 500

        return jsonify({
            "translation": translation
        })

    except requests.exceptions.RequestException as error:
        print("Translation API error:", error)

        return jsonify({
            "error": "Could not connect to the translation service."
        }), 500

    except Exception as error:
        print("Server error:", error)

        return jsonify({
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )