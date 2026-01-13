#!/bin/bash

API_BASE="https://thaivariety.app/api"
TIMESTAMP=$(date +%s)

echo "🧪 Testing Frontend Registration (Deployed)"
echo "=========================================="
echo ""

# Test 1: Register new client
echo "✅ Test 1: Register as Client (via deployed frontend API)"
RESPONSE=$(curl -s -X POST "$API_BASE/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"client_${TIMESTAMP}\",
    \"email\": \"client_${TIMESTAMP}@test.com\",
    \"password\": \"Test123456\",
    \"role\": \"client\",
    \"birthdate\": \"1995-05-15\"
  }")

ROLE=$(echo "$RESPONSE" | jq -r '.role // empty')
if [ "$ROLE" = "client" ]; then
  echo "   ✓ Client registration successful"
  echo "   Role: $ROLE"
  echo "   Email: client_${TIMESTAMP}@test.com"
else
  echo "   ✗ Failed"
  echo "   Response: $RESPONSE"
fi
echo ""

# Test 2: Register new provider
echo "✅ Test 2: Register as Provider (via deployed frontend API)"
RESPONSE=$(curl -s -X POST "$API_BASE/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"provider_${TIMESTAMP}\",
    \"email\": \"provider_${TIMESTAMP}@test.com\",
    \"password\": \"Test123456\",
    \"role\": \"provider\",
    \"birthdate\": \"1990-03-20\"
  }")

ROLE=$(echo "$RESPONSE" | jq -r '.role // empty')
if [ "$ROLE" = "provider" ]; then
  echo "   ✓ Provider registration successful"
  echo "   Role: $ROLE"
  echo "   Email: provider_${TIMESTAMP}@test.com"
else
  echo "   ✗ Failed"
  echo "   Response: $RESPONSE"
fi

echo ""
echo "=========================================="
echo "✅ Frontend Registration Test Complete!"
