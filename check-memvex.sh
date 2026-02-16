#!/usr/bin/env bash
echo "🔍 Memvex Diagnostic Check"
echo "=========================="
echo ""

echo "1. Checking database files:"
ls -lh data/*.db .memvex/*.db 2>/dev/null || echo "  ❌ No database files found"
echo ""

echo "2. Checking if Dashboard is running:"
curl -s http://localhost:3001/api/status > /dev/null && echo "  ✅ Dashboard is running" || echo "  ❌ Dashboard not responding"
echo ""

echo "3. Current memories in Dashboard:"
curl -s http://localhost:3001/api/memory | python -m json.tool 2>/dev/null || curl -s http://localhost:3001/api/memory
echo ""

echo "4. memvex.yaml config:"
grep -A 3 "memory:" memvex.yaml
echo ""

echo "📋 Next Steps:"
echo "  1. In Claude Desktop, type EXACTLY: 'use the memory_store tool to remember that I tested Memvex'"
echo "  2. Wait 3 seconds"
echo "  3. Run: curl http://localhost:3001/api/memory"
echo "  4. You should see the stored memory!"
