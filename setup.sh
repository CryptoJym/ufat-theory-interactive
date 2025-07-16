#!/bin/bash

echo "🌌 UFAT Theory Interactive Experience - Setup"
echo "============================================="
echo ""
echo "This trauma-informed experience helps people understand"
echo "the Universal Field Approximation Theory through:"
echo "- 3D visualizations of universal connection"
echo "- Interactive thought experiments"
echo "- Gentle, self-paced learning"
echo ""

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating environment file..."
    cat > .env.local << EOF
# Add any API keys or environment variables here
NEXT_PUBLIC_APP_NAME=UFAT Theory
NEXT_PUBLIC_APP_DESCRIPTION=Discover the unity of all existence
EOF
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. When ready to deploy, run './deploy.sh'"
echo ""
echo "Remember: This experience is designed for people who may"
echo "disengage quickly. The opening 3D visualization captures"
echo "attention immediately, and users control their journey."