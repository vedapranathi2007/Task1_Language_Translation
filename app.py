from flask import Flask, request, jsonify, send_from_directory
import requests

app = Flask(__name__)


# Open the translator webpage
@app.route("/")
def home():
    return send_from_directory(".", "index.html")


# Serve CSS and JavaScript files
@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(".", filename)


# Translation API
@app.route("/translate", methods=["POST"])
def translate():

    try:
        data = request.get_json()

        text = data.get("text", "").strip()
        source = data.get("source", "").strip()
        target = data.get("target", "").strip()

        # Check input
        if not text:
            return jsonify({
                "error": "Please enter some text."
            }), 400

        if not target:
            return jsonify({
                "error": "Please select a target language."
            }), 400

        # MyMemory API
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

        result = response.json()

        # Check API response
        if response.status_code != 200:
            return jsonify({
                "error": "Translation API error."
            }), 500

        translation = result.get("responseData", {}).get(
            "translatedText", ""
        )

        if not translation:
            return jsonify({
                "error": "Translation could not be generated."
            }), 500

        return jsonify({
            "translation": translation
        })

    except requests.exceptions.RequestException:
        return jsonify({
            "error": "Could not connect to the translation service."
        }), 500

    except Exception as error:
        print("Error:", error)

        return jsonify({
            "error": "An unexpected error occurred."
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )