# 导入NumPy库，用于数值计算和数组操作
import numpy as np

# 创建一个一维数组，包含0到9的整数
tang_array = np.arange(10)
print(tang_array)  # 输出: [0 1 2 3 4 5 6 7 8 9]

# 打印数组的形状
print(tang_array.shape)  # 输出: (10,) 表示一维数组，有10个元素

# 直接修改数组的形状为2行5列
tang_array.shape = 2,5
print(tang_array)  # 输出: [[0 1 2 3 4] [5 6 7 8 9]]

# 使用reshape方法将数组重塑为1行10列，返回新数组（不改变原数组）
print(tang_array.reshape(1,10))  # 输出: [[0 1 2 3 4 5 6 7 8 9]]

# 重新创建一个一维数组
tang_array = np.arange(10)
print(tang_array.shape)  # 输出: (10,)

# 在行维度上添加一个新轴，将一维数组转换为二维数组（1行10列）
tang_array = tang_array[np.newaxis,:]
print(tang_array.shape)  # 输出: (1, 10)

# 重新创建一个一维数组
tang_array = np.arange(10)
print(tang_array.shape)  # 输出: (10,)
print(tang_array)  # 输出: [0 1 2 3 4 5 6 7 8 9]

# 在列维度上添加一个新轴，将一维数组转换为二维数组（10行1列）
tang_array = tang_array[:,np.newaxis]
print(tang_array.shape)  # 输出: (10, 1)
print(tang_array)  # 输出: [[0] [1] [2] [3] [4] [5] [6] [7] [8] [9]]

# 再次在列维度上添加一个新轴，将二维数组转换为三维数组（10行1列1深度）
tang_array = tang_array[:,np.newaxis]
print(tang_array)  # 输出: [[[0]] [[1]] [[2]] [[3]] [[4]] [[5]] [[6]] [[7]] [[8]] [[9]]]
print(tang_array.shape)  # 输出: (10, 1, 1)

# 使用squeeze()方法移除所有长度为1的维度，将三维数组压缩回一维数组
tang_array = tang_array.squeeze()
print(tang_array.shape)  # 输出: (10,)
print(tang_array)  # 输出: [0 1 2 3 4 5 6 7 8 9]

# 将数组形状修改为2行5列
tang_array.shape = 2,5
print(tang_array)  # 输出: [[0 1 2 3 4] [5 6 7 8 9]]

# 使用transpose()方法对数组进行转置（行列互换）
print(tang_array.transpose())  # 输出: [[0 5] [1 6] [2 7] [3 8] [4 9]]

# 使用.T属性对数组进行转置（与transpose()效果相同）
print(tang_array.T)  # 输出: [[0 5] [1 6] [2 7] [3 8] [4 9]]

# 创建一个2行3列的二维数组a
a = np.array([[123,456,678],[3214,456,134]])
print(a)  # 输出: [[ 123  456  678] [3214  456  134]]
print(a.shape)  # 输出: (2, 3)

# 创建另一个2行3列的二维数组b
b = np.array([[1235,3124,432],[43,13,134]])
print(b)  # 输出: [[1235 3124  432] [  43   13  134]]

# 沿着第一个轴（行方向）连接数组a和b，默认axis=0
c = np.concatenate((a,b))
print(c)  # 输出: [[ 123  456  678] [3214  456  134] [1235 3124  432] [  43   13  134]]

# 沿着第二个轴（列方向）连接数组a和b
c = np.concatenate((a,b),axis=1)
print(c)  # 输出: [[ 123  456  678 1235 3124  432] [3214  456  134   43   13  134]]

# 使用vstack()垂直堆叠数组（沿行方向连接，等同于axis=0的concatenate）
print(np.vstack((a,b)))  # 输出: [[ 123  456  678] [3214  456  134] [1235 3124  432] [  43   13  134]]

# 使用hstack()水平堆叠数组（沿列方向连接，等同于axis=1的concatenate）
print(np.hstack((a,b)))  # 输出: [[ 123  456  678 1235 3124  432] [3214  456  134   43   13  134]]

# 分隔线
print("====")

# 使用flatten()方法将数组展平为一维数组（返回数组的副本，不改变原数组）
print(a.flatten())  # 输出: [ 123  456  678 3214  456  134]

# 使用ravel()方法将数组展平为一维数组（返回视图，可能改变原数组）
print(a.ravel())  # 输出: [ 123  456  678 3214  456  134]

