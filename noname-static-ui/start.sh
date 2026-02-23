#!/bin/bash

echo "========================================"
echo "  无名杀静态界面展示"
echo "========================================"
echo ""
echo "正在启动本地服务器..."
echo ""

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    echo "使用Python3启动服务器..."
    echo "请在浏览器中访问: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
    exit 0
fi

# 检查Python2是否安装
if command -v python &> /dev/null; then
    echo "使用Python启动服务器..."
    echo "请在浏览器中访问: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python -m http.server 8000
    exit 0
fi

# 检查Node.js是否安装
if command -v node &> /dev/null; then
    echo "使用Node.js启动服务器..."
    echo "请在浏览器中访问: http://localhost:8080"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    npx http-server -p 8080
    exit 0
fi

# 检查PHP是否安装
if command -v php &> /dev/null; then
    echo "使用PHP启动服务器..."
    echo "请在浏览器中访问: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    php -S localhost:8000
    exit 0
fi

echo "未找到Python、Node.js或PHP"
echo "请直接在浏览器中打开 index.html 文件"
echo ""