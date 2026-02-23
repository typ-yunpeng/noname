# 导入 NumPy 库，用于数值计算
import numpy as np
# 从 numpy.ma.core 模块导入 arange 函数（用于创建数组）
# from numpy.ma.core import arange

# 创建一个包含 [1, 2, 3] 的一维数组并打印
print(np.array([1,2,3]))

# 创建从 0 到 9 的一维数组（不包含 10），步长默认为 1
print(np.arange(10))

# 使用 arange 创建从 2 到 19 的一维数组，步长为 2（不包含 20）
print(arange(2,20,2))
# 同上，但指定数据类型为 int32（32位整数）
print(arange(2,20,2,dtype=np.int32))
# 同上，但指定数据类型为 float32（32位浮点数）
print(arange(2,20,2,dtype=np.float32))
# 创建从 0 到 10 的等间距数组，共 50 个元素（包含 0 和 10）
print(np.linspace(0,10,50))

# 注释掉的代码：打印 np.logspace(10,20) 的帮助文档
# np.logspace(10,20) 会创建从 10^10 到 10^20 的对数空间数组，默认生成 50 个元素
# 具体含义：起始值 10^10=10000000000，结束值 10^20=100000000000000000000
# 数组中的元素在对数尺度上均匀分布，常用于频率分析、信号处理等场景
# print(help(np.logspace(10,20)))
# 打印 np.logspace 函数的帮助文档
print(help(np.logspace))

# 创建对数空间数组：从 10^0 到 10^1，共 5 个元素
print(np.logspace(0,1,5))

# 创建 x 坐标数组：从 -10 到 10 的等间距数组，共 5 个元素
x = np.linspace(-10,10,5)
print(x)
# 创建 y 坐标数组：从 -10 到 10 的等间距数组，共 5 个元素
y = np.linspace(-10,10,5)
print(y)

# 使用 meshgrid 创建网格坐标矩阵，将一维数组扩展为二维网格
x,y = np.meshgrid(x,y)
print(x)
print(y)

# 使用 np.r_ 创建行向量：从 0 到 9，步长为 1（不包含 10）
print(np.r_[0:10:1])
# 使用 np.c_ 创建列向量：从 0 到 9，步长为 1（不包含 10）
print(np.c_[0:10:1])