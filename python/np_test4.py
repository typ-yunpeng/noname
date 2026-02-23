# 导入 NumPy 库，用于数值计算
import numpy as np

# 创建一个 2x3 的二维数组
tang_array = np.array([[1,2,3],[4,5,6]])
print(tang_array)

# 计算数组所有元素的总和
print(np.sum(tang_array))

# 沿着 axis=0（列方向）求和，即每列元素相加
print(np.sum(tang_array,axis=0))

# 打印数组的维度（ndim = number of dimensions）
print(tang_array.ndim)

# 沿着 axis=1（行方向）求和，即每行元素相加
print(np.sum(tang_array,axis=1))

# axis=-1 表示最后一个维度，对于二维数组等同于 axis=1
print(np.sum(tang_array,axis=-1))

# 使用数组对象的 sum() 方法，等同于 np.sum(tang_array)
print(tang_array.sum())

# 使用数组对象的 sum() 方法，沿列方向求和
print(tang_array.sum(axis=0))

# 使用数组对象的 sum() 方法，沿行方向求和
print(tang_array.sum(axis=1))

# 计算数组所有元素的乘积
print(tang_array.prod())

# 沿列方向计算乘积
print(tang_array.prod(axis=0))

# 沿行方向计算乘积
print(tang_array.prod(axis=1))

# 找出数组中的最小值
print(tang_array.min())

# 沿列方向找出每列的最小值
print(tang_array.min(axis=0))

# 沿行方向找出每行的最小值
print(tang_array.min(axis=1))

# 找出数组中的最大值
print(tang_array.max())

# 打印数组内容
print(tang_array)

# 找出数组中最小值的索引（扁平化后的索引）
print(tang_array.argmin())

# 沿列方向找出每列最小值的索引
print(tang_array.argmin(axis=0))

# 沿行方向找出每行最小值的索引
print(tang_array.argmin(axis=1))

# 找出数组中最大值的索引（扁平化后的索引）
print(tang_array.argmax())

# 计算数组所有元素的平均值
print(tang_array.mean())

# 沿列方向计算每列的平均值
print(tang_array.mean(axis=0))

# 计算数组所有元素的标准差（standard deviation）
print(tang_array.std())

# 沿行方向计算每行的标准差
print(tang_array.std(axis=1))

# 计算数组所有元素的方差（variance）
print(tang_array.var())

# 将数组元素裁剪到 [2, 4] 范围内，小于2的变为2，大于4的变为4
print(tang_array.clip(2,4))

# 创建一个包含浮点数的一维数组
tang_array = np.array([1.2,3.56,6.41])

# 对数组元素进行四舍五入到整数
print(tang_array.round())

# 对数组元素进行四舍五入，保留1位小数
print(tang_array.round(decimals=1))
