import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./Products.module.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async () => {
    if (!name || !price || !stock) {
      alert("Please fill all fields");
      return;
    }

    await api.post("/products", { name, price, stock });
    loadProducts();
    setName("");
    setPrice("");
    setStock("");
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const openEdit = (product) => {
    setEditId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditStock(product.stock);
  };

  const updateProduct = async () => {
    await api.put(`/products/${editId}`, {
      name: editName,
      price: editPrice,
      stock: editStock,
    });

    setEditId(null);
    loadProducts();
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.productsPage}>
      <h1 className={styles.pageTitle}>Products</h1>

      <div className={styles.cardsRow}>
        <div className={styles.card}>
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className={styles.card}>
          <h3>Available Stock</h3>
          <p>{products.reduce((total, p) => total + Number(p.stock), 0)}</p>
        </div>

        <div className={styles.card}>
          <h3>Shop Type</h3>
          <p>Stationary</p>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Add Product Form */}
        <div className={`${styles.card} ${styles.formCard}`}>
          <h2>Add Product</h2>

          <input
            value={name}
            placeholder="Product Name"
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            value={price}
            placeholder="Price (Rs)"
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
          />
          <input
            value={stock}
            placeholder="Stock"
            onChange={(e) => setStock(e.target.value)}
            className={styles.input}
          />

          <button onClick={addProduct} className={styles.primaryBtn}>
            Add Product
          </button>
        </div>

        {/* Manage Products Table */}
        <div className={`${styles.card} ${styles.listCard}`}>
          <h2>Manage Products</h2>

          <input
            className={styles.search}
            value={search}
            placeholder="Search Product..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (Rs)</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit Modal */}
          {editId && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h3>Edit Product</h3>

                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={styles.input}
                />
                <input
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className={styles.input}
                />
                <input
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className={styles.input}
                />

                <button className={styles.primaryBtn} onClick={updateProduct}>
                  Update
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
