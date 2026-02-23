# 导入 NumPy 库，用于数值计算
import numpy as np

# 创建一个 2x3 的二维数组，包含浮点数
tang_array = np.array([[1.5,1.3,7.5],[5.6,7.8,1.2]])
print(tang_array)

# 对数组进行排序，默认沿最后一个轴（axis=-1，即行方向）排序
# 每行内部元素按升序排列
print(np.sort(tang_array))

# 沿着 axis=0（列方向）排序，即每列元素按升序排列
print(np.sort(tang_array,axis=0))

# 返回排序后的索引数组，而不是排序后的值
# 索引指示了元素在排序后数组中的位置
print(np.argsort(tang_array))

# 创建一个从 0 到 10 的等间距数组，共 10 个元素
tang_array = np.linspace(0,10,10)
print(tang_array)

# 创建要查找的值数组
values = np.array([2.5,6.5,9.5])

# 在有序数组中查找每个值的插入位置，以保持数组有序
# 返回的是应该插入的索引位置
print(np.searchsorted(tang_array,values))

# 创建一个 4x3 的二维数组，用于演示多键排序
tang_array = np.array([[1,0,6],
                       [1,7,0],
                       [2,3,1],
                       [2,4,0]])
print(tang_array)

# 使用 lexsort 进行多键排序（字典序排序）
# 排序键从后往前应用：
# 1. 首先按 tang_array[:,2]（第3列）升序排序
# 2. 然后按 -1*tang_array[:,0]（第1列取负）升序排序，即原第1列降序排序
# 返回的是排序后的索引数组
index = np.lexsort([-1*tang_array[:,0],tang_array[:,2]])
print(index)

# 使用排序后的索引重新排列数组
tang_array = tang_array[index]
print(tang_array)

