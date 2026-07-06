# project/app/main.py


import logging

from fastapi import FastAPI

from app.api import ping, summaries  # updated
from app.db import init_db


log = logging.getLogger("uvicorn")


def create_application() -> FastAPI:
    application = FastAPI()
    application.include_router(ping.router)
    application.include_router(summaries.router, prefix="/summaries", tags=["summaries"])  # new

    application.add_middleware(  # new
            CORSMiddleware,
            allow_origins=["*"],  # tighten this to your actual frontend URL once deployed
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
    return application


app = create_application()

init_db(app)
