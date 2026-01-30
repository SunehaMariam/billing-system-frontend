import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./Reports.module.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [report, setReport] = useState({
    totalBills: 0,
    totalSales: 0,
    totalProductsSold: 0,
    bestSelling: [],
  });

  useEffect(() => {
    api.get("/reports/daily")
      .then(res => setReport(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className={styles.reportsPage}>
      <h1 className={styles.title}>📊 Daily Report</h1>

      {/* SUMMARY CARDS */}
      <div className={styles.cardsRow}>
        <div className={styles.card}>
          <h3>Total Bills</h3>
          <p>{report.totalBills}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Sales</h3>
          <p>Rs {report.totalSales}</p>
        </div>

        <div className={styles.card}>
          <h3>Products Sold</h3>
          <p>{report.totalProductsSold}</p>
        </div>
      </div>

      {/* SALES CHART */}
      <div className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>Best Selling Products</h2>

        {report.bestSelling?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.bestSelling}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className={styles.noData}>No chart data available</p>
        )}
      </div>

      {/* LIST */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Product Details</h2>

        {report.bestSelling?.length ? (
          report.bestSelling.map((p, index) => (
            <div className={styles.productRow} key={index}>
              <span>{p.name}</span>
              <strong>{p.sold} sold</strong>
            </div>
          ))
        ) : (
          <p className={styles.noData}>No data available yet</p>
        )}
      </div>
    </div>
  );
}
