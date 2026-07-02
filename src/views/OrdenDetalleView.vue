<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useOrdenStore } from "../store/ordenStore.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // importar la función

const route = useRoute();
const router = useRouter();
const ordenStore = useOrdenStore();

onMounted(async () => {
  const ordenId = route.params.id;
  await ordenStore.getOrdenById(ordenId);
});

function volverAMisCompras() {
  router.push("/home");
}

function exportarPDF() {
  const orden = ordenStore.ordenActual;
  if (!orden) return;

  const doc = new jsPDF();

  // Encabezado limpio (sin emoji)
  doc.setFontSize(18);
  doc.text("Millennial's Store", 105, 15, { align: "center" });
  doc.setFontSize(14);
  doc.text("Detalle de la compra", 105, 25, { align: "center" });
  doc.line(20, 30, 190, 30);

  // Datos generales (sin método de pago)
  const datos = [
    ["ID", orden._id],
    ["Fecha", new Date(orden.fechaCreacion).toLocaleString("es-CL")],
    ["Estado", orden.estado],
  ];

  autoTable(doc, {
    startY: 35,
    body: datos,
    theme: "plain",
    styles: { fontSize: 11, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold" },
      1: { textColor: [60, 60, 60] },
    },
  });

  // Tabla de productos
  const productos = orden.items.map((item) => [
    item.nombre,
    item.cantidad,
    `$${item.precio.toLocaleString("es-CL")}`,
    `$${item.subtotal.toLocaleString("es-CL")}`,
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Producto", "Cantidad", "Precio", "Subtotal"]],
    body: productos,
    theme: "grid",
    headStyles: {
      fillColor: [13, 110, 253],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total: $${orden.total.toLocaleString("es-CL")}`,
    190,
    doc.lastAutoTable.finalY + 10,
    { align: "right" }
  );

  // Pie de página
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Gracias por tu compra - Millennial's Store", 105, 285, {
    align: "center",
  });

  doc.save(`Orden_${orden._id}.pdf`);
}
</script>



<template>
  <div class="container my-5">
    <div class="text-center mb-4">
      <h2 class="fw-bold text-primary">🧾 Detalle de la compra</h2>
      
    </div>

    <div v-if="ordenStore.ordenActual" class="card shadow-sm p-4 mx-auto detalle-orden">
      <div class="mb-3">
        <p><strong>ID:</strong> {{ ordenStore.ordenActual._id }}</p>
        <p><strong>Fecha:</strong> {{ new Date(ordenStore.ordenActual.fechaCreacion).toLocaleString("es-CL") }}</p>
        <p>
          <strong>Estado:</strong>
          <span :class="ordenStore.ordenActual.estado === 'pagado' ? 'badge bg-success' : 'badge bg-warning'">
            {{ ordenStore.ordenActual.estado }}
          </span>
        </p>
      
      </div>

      <h5 class="fw-semibold mt-4">Productos</h5>
      <table class="table table-hover align-middle mt-2">
        <thead class="table-primary text-white">
          <tr>
            <th>Producto</th>
            <th class="text-center">Cantidad</th>
            <th class="text-end">Precio</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ordenStore.ordenActual.items" :key="item.productoId">
            <td>{{ item.nombre }}</td>
            <td class="text-center">{{ item.cantidad }}</td>
            <td class="text-end">${{ item.precio.toLocaleString("es-CL") }}</td>
            <td class="text-end">${{ item.subtotal.toLocaleString("es-CL") }}</td>
          </tr>
        </tbody>
      </table>

      <div class="text-end fw-bold fs-5 mt-3">
        Total: ${{ ordenStore.ordenActual.total.toLocaleString("es-CL") }}
      </div>

      <div class="d-flex justify-content-between mt-4">
        <button class="btn btn-dark px-4" @click="volverAMisCompras">
          ← Volver a la página principal
        </button>
        <button class="btn btn-outline-primary px-4" @click="exportarPDF">
          📄 Exportar en PDF
        </button>
      </div>
    </div>

    <div v-else class="text-center mt-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-3">Cargando detalle de la compra..</p>
    </div>
  </div>
</template>

