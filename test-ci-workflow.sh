#!/bin/bash
set -e

echo "🧪 Testing CI Workflow Components"
echo "================================="

# Test 1: Turborepo package detection
echo ""
echo "📦 Testing package detection..."
PACKAGES=$(pnpm turbo run build --dry=json | jq -r '.packages | length')
echo "Found $PACKAGES packages total"

# Test 2: Web-only filtering
echo ""
echo "🌐 Testing web-only filtering..."
WEB_PACKAGES=$(pnpm turbo run build --dry=json --filter='{packages/*}' --filter='{services/*}' --filter='{apps/web}' | jq -r '.packages | length')
echo "Found $WEB_PACKAGES web-related packages"

# Test 3: Mobile-only filtering
echo ""
echo "📱 Testing mobile-only filtering..."
MOBILE_PACKAGES=$(pnpm turbo run lint --dry=json --filter='trip-sync-mobile' | jq -r '.packages | length')
echo "Found $MOBILE_PACKAGES mobile packages"

# Test 4: Affected package detection simulation
echo ""
echo "🔍 Testing affected package detection..."
AFFECTED_PACKAGES=$(pnpm turbo run build --dry=json --filter="...[HEAD~1]" | jq -r '.packages | length')
echo "Found $AFFECTED_PACKAGES affected packages since last commit"

# Test 5: Command syntax validation
echo ""
echo "✅ Testing individual commands..."

# Test lint command
echo "  - Testing lint command..."
pnpm turbo run lint --filter='{packages/*}' --filter='{services/*}' --filter='{apps/web}' > /dev/null 2>&1 && echo "    ✅ Lint command works" || echo "    ❌ Lint command failed"

# Test typecheck command  
echo "  - Testing typecheck command..."
pnpm turbo run typecheck --filter='{packages/*}' --filter='{services/*}' --filter='{apps/web}' > /dev/null 2>&1 && echo "    ✅ Typecheck command works" || echo "    ❌ Typecheck command failed"

# Test build command
echo "  - Testing build command..."
pnpm turbo run build --filter='{packages/*}' --filter='{services/*}' --filter='{apps/web}' > /dev/null 2>&1 && echo "    ✅ Build command works" || echo "    ❌ Build command failed"

# Test 6: Mobile commands
echo ""
echo "📱 Testing mobile commands..."
echo "  - Testing mobile lint..."
pnpm --filter=trip-sync-mobile lint > /dev/null 2>&1 && echo "    ✅ Mobile lint works" || echo "    ❌ Mobile lint failed"

echo "  - Testing mobile type-check..."
pnpm --filter=trip-sync-mobile type-check > /dev/null 2>&1 && echo "    ✅ Mobile type-check works" || echo "    ❌ Mobile type-check failed"

echo ""
echo "🎉 Test completed! Check results above."
echo "================================="