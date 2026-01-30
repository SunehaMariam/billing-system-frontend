import { useEffect, useState } from "react";
import api from "../services/api";
import { generateInvoice } from "../utils/generateInvoice";
import style from "./Billing.module.css";

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState("");

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Products fetch error", err));
  }, []);

  /* ================= CART FUNCTIONS ================= */

  const addToCart = (p) => {
    const existing = cart.find(i => i.productId === p._id);

    if (existing) {
      if (existing.qty >= p.stock) {
        alert("⚠ Stock limit reached");
        return;
      }
      setCart(cart.map(i =>
        i.productId === p._id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCart([...cart, {
        productId: p._id,
        name: p.name,
        price: p.price,
        qty: 1
      }]);
    }
  };

  const incQty = (id) => {
    setCart(cart.map(i =>
      i.productId === id ? { ...i, qty: i.qty + 1 } : i
    ));
  };

  const decQty = (id) => {
    setCart(cart.map(i =>
      i.productId === id && i.qty > 1
        ? { ...i, qty: i.qty - 1 }
        : i
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(i => i.productId !== id));
  };

  /* ================= BILL CALCULATIONS ================= */

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const change = paidAmount ? paidAmount - total : 0;

  /* ================= CREATE BILL ================= */

  const createBill = async () => {
    if (cart.length === 0) {
      alert("🛒 Cart is empty");
      return;
    }

    const paid = Number(paidAmount);
if (paid < total) {
  alert("💰 Paid amount is less than total");
  return;
}


    try {
      const res = await api.post("/bills", {
        customer,
        paymentMethod,
        items: cart,
        totalAmount: total,
        paidAmount,
        changeReturn: change
      });

      generateInvoice(res.data); // 🔥 PDF Invoice

      alert(`✅ Bill Created\nBill No: ${res.data.billNo}`);

      setCart([]);
      setCustomer("");
      setPaidAmount("");

    } catch (err) {
      console.error(err);
      alert("❌ Bill creation failed");
    }
  };

  return (
    <div className={style.container}>


  
 
      {/* PRODUCTS */}
      <div className={style.products}>
        <h2>Products</h2>
        {products.map(p => (
          <div key={p._id} className={style.productItem}>
            <span>{p.name}</span>
            <span>Rs {p.price}</span>
            <span>Stock: {p.stock}</span>
            <button onClick={() => addToCart(p)}>Add</button>
          </div>
        ))}
      </div>

      {/* BILLING */}
      <div className={style.billing}>
        <h2>Billing</h2>

        <input
          placeholder="Customer Name (optional)"
          value={customer}
          onChange={e => setCustomer(e.target.value)}
        />

        <h3>Cart</h3>
        {cart.map(i => (
          <div key={i.productId} className={style.cartItem}>
            <span>{i.name}</span>
            <span>{i.qty} × Rs {i.price}</span>
            <button onClick={() => incQty(i.productId)}>+</button>
            <button onClick={() => decQty(i.productId)}>-</button>
            <button onClick={() => removeItem(i.productId)}>❌</button>
          </div>
        ))}

        <h3>Total: Rs {total}</h3>

        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <option>Cash</option>
          <option>Card</option>
          <option>Online</option>
        </select>

        <input
          type="number"
          placeholder="Paid Amount"
          value={paidAmount}
          onChange={e => setPaidAmount(e.target.value)}
        />

        <h4>Change: Rs {change}</h4>

        <button onClick={createBill} className={style.billBtn}>
          Create Bill & Invoice
        </button>
        {/* BACK BUTTON */}
  <button
    className={style.backBtn}
    onClick={() => window.history.back()}
  >
    Back
  </button>
    </div>
      </div>

      
    
  );
}
