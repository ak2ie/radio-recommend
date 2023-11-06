# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
from flask import Flask, jsonify, request
import logging
from lda_content import LDAContentRecommender

initialize_app()
options.set_global_options(region=options.SupportedRegion.ASIA_NORTHEAST1)
app = Flask(__name__)

# ログ設定
logging.basicConfig(
        format = "[%(asctime)s][%(levelname)s] %(message)s",
        level = logging.DEBUG
    )
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# 日本語を扱う
app.config['JSON_AS_ASCII'] = False

@app.get("/widgets")
@app.get("/widgets/<id>")
def get_widget(id=None):
    if id is not None:
        return "ID is set"
    else:
        return "ID is not set"

@app.post("/widgets")
def add_widget():
    new_widget = Flask.request.get_data(as_text=True)
    return Flask.Response(status=201, response="Added Widget")

@app.get("/programs")
def get_programs():
    db = firestore.client()
    mes_ref = db.collection("messages").document("cEeNK8441GQ0SCLhHRSX")
    mes = mes_ref.get()
    return mes.to_dict()

@app.post("/pred/tags")
def pred_tags():
    body = request.json["tags"]
    logger.debug(body)
    json = {
        "name": "おいでよクリエイティ部"
    }
    return jsonify(json)

@app.post("/pred/programs")
def pred_programs():
    body = request.json["programs"]
    
    recommend = LDAContentRecommender()
    logger.debug(recommend.recommend())
    json = {
        "name": "おいでよクリエイティ部"
    }
    return jsonify(json)

@https_fn.on_request()
def radio_recommend(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()