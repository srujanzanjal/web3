from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, activities, rewards, leaderboard, badges

app = FastAPI(title="CosmicFit API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(activities.router, prefix="/activities", tags=["activities"])
app.include_router(rewards.router, prefix="/rewards", tags=["rewards"])
app.include_router(leaderboard.router, tags=["leaderboard"])
app.include_router(badges.router, prefix="/badges", tags=["badges"])

@app.get("/health")
async def health():
    return {"status": "ok"}
