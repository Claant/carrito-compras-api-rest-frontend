<template>
  <div>
    <h2 class="fw-bold mb-4">📊 Reportes de Ventas</h2>

    <!-- Filtro por producto -->
    <div v-if="tipoReporte === 'producto'" class="mb-3">
      <label class="fw-semibold me-2">Filtrar producto:</label>
      <select v-model="productoSeleccionado" @change="filtrarProducto" class="form-select w-auto">
        <option value="">Todos</option>
        <option v-for="p in productos" :key="p._id" :value="p.nombre">{{ p.nombre }}</option>
      </select>
    </div>

    <!-- Gráfico dinámico -->
    <div class="chart-container">
      <canvas id="graficoVentas"></canvas>
    </div>

    <button @click="exportarPDF" class="btn btn-outline-primary mt-3">
      Exportar PDF
    </button>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import jsPDF from "jspdf";

export default {
  setup() {
    const route = useRoute();
    const tipoReporte = ref(route.params.tipo || "mensual");
    const datos = ref([]);
    const productos = ref([]);
    const productoSeleccionado = ref("");
    let chart = null;
    const api = import.meta.env.VITE_API_URL;

    const cargarReporte = async () => {
      let url = "";
  switch (tipoReporte.value) {
  case "diaria": url = `${api}/api/reportes/ventas-diarias`; break;
  case "semanal": url = `${api}/api/reportes/ventas-semanales`; break;
  case "mensual": url = `${api}/api/reportes/ventas-mensuales`; break;
  case "anual": url = `${api}/api/reportes/ventas-anuales`; break;
  case "producto": url = `${api}/api/reportes/ventas-productos`; break;
}


      const res = await fetch(url);
      const data = await res.json();
      datos.value = data;

      if (tipoReporte.value === "producto") {
        productos.value = data.map(d => d._id);
      }

      renderChart(data);
    };

    const filtrarProducto = () => {
      if (productoSeleccionado.value) {
        const filtrado = datos.value.filter(d => d._id.nombre === productoSeleccionado.value);
        renderChart(filtrado);
      } else {
        renderChart(datos.value);
      }
    };

    const renderChart = (data) => {
      if (chart) chart.destroy();
      const ctx = document.getElementById("graficoVentas");

      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map(d => {
            // Manejo dinámico de etiquetas según tipo de reporte
            if (tipoReporte.value === "diaria" && d._id.fecha) {
              const fecha = new Date(d._id.fecha);
              return fecha.toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
            }
            if (tipoReporte.value === "semanal") {
              return `Semana ${d._id.semana}`;
            }
            if (tipoReporte.value === "mensual") {
              return `${d._id.mes}/${d._id.year}`;
            }
            if (tipoReporte.value === "anual") {
              return d._id.year;
            }
            if (tipoReporte.value === "producto") {
              return d._id.nombre;
            }
            return "N/A";
          }),
          datasets: [{
            label: "VENTAS",
            data: data.map(d => d.totalVentas || d.total),
            backgroundColor: "rgba(54, 162, 235, 0.6)"
          }]
        },
        options: {
          indexAxis: tipoReporte.value === "producto" ? "y" : "x",
          plugins: {
            legend: {
    display: false  }, // ← oculta la leyenda
            title: {
              display: true,
              text: `Venta ${tipoReporte.value}`,
              color: "#333",
              font: { size: 22, weight: "bold" },
              align: "center",   // centra el título
              padding: { top: 0, bottom: 20 }
            },
            datalabels: {
              anchor: "end",
              align: "top",
              formatter: (value) => `$${value.toLocaleString("es-CL")}`,
              color: "#333",
              font: { weight: "bold", size: 12 }
            }
          },
          scales: {
            y: { beginAtZero: true },
            x: { beginAtZero: true }
          }
        },
        plugins: [ChartDataLabels]
      });
    };

    const exportarPDF = () => {
      const doc = new jsPDF();
      doc.text(`Reporte de Ventas (${tipoReporte.value})`, 20, 20);
      datos.value.forEach((d, i) => {
        doc.text(`${i + 1}. ${d._id.nombre || d._id.mes || d._id.fecha || d._id.year}: ${d.totalVentas}`, 20, 40 + i * 10);
      });
      doc.save(`reporte-${tipoReporte.value}.pdf`);
    };

    onMounted(cargarReporte);

    watch(() => route.params.tipo, (nuevo) => {
      tipoReporte.value = nuevo || "mensual";
      cargarReporte();
    });

    return { exportarPDF, tipoReporte, productos, productoSeleccionado, filtrarProducto };
  }
};
</script>
