# deploy.ps1

# Install Vercel CLI if not already installed
npm install -g vercel

# Log in to Vercel (will open browser for auth)
vercel login

# Link the project (only first time)
vercel link

# Set environment variables in Vercel
vercel env add DATABASE_URL "postgresql://neondb_owner:npg_9feQTOiMrAH2@ep-mute-field-a8gaqus6-pooler.eastus2.azure.neon.tech/Ai-medical-voice-agent?sslmode=require&channel_binding=require"
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY "pk_test_bGl0ZXJhdGUta2l0ZS05MC5jbGVyay5hY2NvdW50cy5kZXYk"
vercel env add CLERK_SECRET_KEY "sk_test_4Uh9D7q4guYrx47NaxbnGv9OFOqVFHwcpdcTgenmG9"
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL "/sign-in"
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL "/"
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL "/sign-up"
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL "/"
vercel env add NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID "308217a5-287d-48a6-a113-da9c3b459ad2"
vercel env add NEXT_PUBLIC_VAPI_API_KEY "c4c99aa3-ddbe-4fef-a04c-e249d7a71c94"
vercel env add OPEN_ROUTER_API_KEY "<ADD_KEY_IN_VERCEL>"
# Deploy project
vercel --prod
