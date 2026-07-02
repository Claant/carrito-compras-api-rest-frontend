// store/descuentos.js
export const descuentos = {
  "Aceite MIRAFLORES": 3750,
  "Coca cola 1.5L": 2500,
  "Arroz TUCAPEL": 2500
};

export function aplicarDescuentos(productos) {
  return productos.map(prod => {
    if (descuentos[prod.nombre]) {
      prod.precioAntiguo = descuentos[prod.nombre];
    }
    return prod;
  });
}
