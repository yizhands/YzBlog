---
title: HashMap 和 HashTable 的区别
date: 2026-07-16
category: JAVA基础
tags:
  - Java
  - 集合
  - 数据结构
---

### **1\. 引言**

> 在 Java 集合框架中，`HashMap` 和 `HashTable` 都是用于存储键值对（Key-Value）的数据结构，它们基于哈希表（Hash Table）实现，提供了高效的查找、插入和删除操作。然而，尽管它们的功能相似，但在实际开发中，`HashMap` 和 `HashTable` 的使用场景和性能表现却有很大差异。
>
> 本文将深入探讨 `HashMap` 和 `HashTable` 的区别，通过本文，读者可以清晰地理解两者的差异，并在实际开发中选择合适的数据结构。

![](https://i-blog.csdnimg.cn/direct/c724dbfb6d2749bbadc12550ff1dd0dd.png)

### **2\. HashMap 和 HashTable 的基本概念**

#### **2.1 HashMap**

`HashMap` 是 Java 集合框架（Java Collections Framework, JCF）的一部分，自 Java 1.2 引入。它基于哈希表实现，允许存储 `null` 键和 `null` 值，并且是非线程安全的。`HashMap` 提供了高效的查找、插入和删除操作，平均时间复杂度为 **O(1)**。

#### **2.2 HashTable**

`HashTable` 是 Java 早期版本（Java 1.0）提供的键值对存储结构，同样基于哈希表实现。与 `HashMap` 不同，`HashTable` 是线程安全的（所有方法都使用 `synchronized` 修饰），但**不允许 `null` 键和 `null` 值**。由于同步机制，它的性能通常比 `HashMap` 差。

### **3\. HashMap 和 HashTable 的核心区别**

#### **3.1 线程安全性**

| 特性         | HashMap      | HashTable                                 |
| ------------ | ------------ | ----------------------------------------- |
| **线程安全** | ❌ 非线程安全 | ✅ 线程安全（所有方法使用 `synchronized`） |

+   **`HashMap`**：默认情况下，`HashMap` 不是线程安全的。如果多个线程同时修改 `HashMap`（如 `put`、`remove` 操作），可能会导致数据不一致或 `ConcurrentModificationException`。
    
+   **`HashTable`**：由于所有方法都加了 `synchronized` 锁，因此它是线程安全的，但性能较低。
    

**替代方案**：  
如果需要在多线程环境下使用 `HashMap`，可以采用：

1.  **`Collections.synchronizedMap(new HashMap<>())`**（包装成同步 Map）
    
2.  **`ConcurrentHashMap`**（更高效的线程安全 Map）
    

#### **3.2 对 `null` 键和 `null` 值的支持**

| 特性               | HashMap | HashTable                        |
| ------------------ | ------- | -------------------------------- |
| **允许 `null` 键** | ✅       | ❌（抛出 `NullPointerException`） |
| **允许 `null` 值** | ✅       | ❌（抛出 `NullPointerException`） |

**示例：**

```
HashMap<String, String> hashMap = new HashMap<>();
hashMap.put(null, "value");  // 允许
hashMap.put("key", null);    // 允许

Hashtable<String, String> hashtable = new Hashtable<>();
hashtable.put(null, "value");  // 抛出 NullPointerException
hashtable.put("key", null);    // 抛出 NullPointerException
```

#### **3.3 性能对比**

由于 `HashTable` 的所有方法都是同步的，因此在单线程环境下，`HashMap` 的性能明显优于 `HashTable`。

**测试示例：**

```
// HashMap 插入 100 万条数据
HashMap<Integer, Integer> hashMap = new HashMap<>();
long startTime = System.currentTimeMillis();
for (int i = 0; i < 1_000_000; i++) {
    hashMap.put(i, i);
}
long endTime = System.currentTimeMillis();
System.out.println("HashMap 耗时: " + (endTime - startTime) + "ms");

// HashTable 插入 100 万条数据
Hashtable<Integer, Integer> hashtable = new Hashtable<>();
startTime = System.currentTimeMillis();
for (int i = 0; i < 1_000_000; i++) {
    hashtable.put(i, i);
}
endTime = System.currentTimeMillis();
System.out.println("HashTable 耗时: " + (endTime - startTime) + "ms");
```

**结果：**

```
HashMap 耗时: 120ms  
HashTable 耗时: 350ms
```

**结论**：`HashMap` 在单线程环境下性能更高。

#### **3.4 底层实现**

| 特性             | HashMap                  | HashTable                   |
| ---------------- | ------------------------ | --------------------------- |
| **继承关系**     | 继承 `AbstractMap`       | 继承 `Dictionary`（已过时） |
| **初始容量**     | 16                       | 11                          |
| **扩容机制**     | `newSize = 2 * oldSize`  | `newSize = 2 * oldSize + 1` |
| **哈希冲突处理** | 链表 + 红黑树（Java 8+） | 仅链表                      |

**`HashMap` 的优化：**

+   在 Java 8 之后，当链表长度超过 `8` 时，`HashMap` 会将链表转换为红黑树，提高查询效率（时间复杂度从 O(n) 降为 O(log n)）。
    
+   `HashTable` 仍然使用链表处理冲突，没有优化。
    

#### **3.5 迭代方式**

| 特性       | HashMap                        | HashTable                   |
| ---------- | ------------------------------ | --------------------------- |
| **迭代器** | `Iterator`（支持 `fail-fast`） | `Enumeration`（较老的 API） |

**`fail-fast` 机制**：

+   `HashMap` 使用 `Iterator` 遍历，如果在遍历过程中修改结构（如 `remove`），会抛出 `ConcurrentModificationException`。
    
+   `HashTable` 的 `Enumeration` 不是 `fail-fast` 的，但它的方法都是同步的，因此并发修改问题较少。
    

#### **3.6 扩容策略**

| 特性             | HashMap                 | HashTable                   |
| ---------------- | ----------------------- | --------------------------- |
| **默认初始容量** | 16                      | 11                          |
| **扩容公式**     | `newSize = 2 * oldSize` | `newSize = 2 * oldSize + 1` |
| **负载因子**     | 0.75（可调整）          | 0.75                        |

**扩容机制：**

+   `HashMap` 的扩容更高效，因为它总是扩容为 2 的幂次方，便于位运算优化。
    
+   `HashTable` 的扩容计算较慢（`2n + 1`）。
    

### **4\. 现代 Java 开发中的最佳实践**

#### **4.1 为什么 HashTable 已被淘汰？**

1.  **性能低**：由于全局锁机制，`HashTable` 的并发性能较差。
    
2.  **`null` 限制**：不允许 `null` 键值，限制了使用场景。
    
3.  **过时的 API**：`Enumeration` 已被 `Iterator` 取代。
    

#### **4.2 推荐替代方案**

| 场景             | 推荐数据结构                    |
| ---------------- | ------------------------------- |
| **单线程环境**   | `HashMap`                       |
| **高并发环境**   | `ConcurrentHashMap`             |
| **遗留代码兼容** | `HashTable`（不推荐新代码使用） |

**`ConcurrentHashMap` 的优势：**

+   采用分段锁（Java 7）或 CAS + `synchronized`（Java 8+），比 `HashTable` 性能更高。
    
+   允许部分并发修改，提高吞吐量。
    

### **5\. 总结**

| 对比维度         | HashMap                   | HashTable                |
| ---------------- | :------------------------ | ------------------------ |
| **线程安全**     | ❌ 非线程安全              | ✅ 线程安全（但性能低）   |
| **`null` 支持**  | ✅ 允许 `null` 键值        | ❌ 不允许 `null`          |
| **性能**         | ⭐⭐⭐⭐（单线程高效）        | ⭐⭐（同步开销大）         |
| **底层结构**     | 数组 + 链表/红黑树        | 数组 + 链表              |
| **迭代方式**     | `Iterator`（`fail-fast`） | `Enumeration`            |
| **扩容策略**     | `2n`（更高效）            | `2n + 1`                 |
| **现代替代方案** | 默认选择                  | 使用 `ConcurrentHashMap` |

#### **最终建议**

+   **优先使用 `HashMap`**（单线程场景）。
    
+   **多线程环境下使用 `ConcurrentHashMap`**（而不是 `HashTable`）。
    
+   **避免在新代码中使用 `HashTable`**（它是遗留类）。