const { Donacion, Donante, Usuario, Producto, DonacionProducto } = require('../models/index');

const obtenerDonaciones = async (req, res) => {
  try {
    const donaciones = await Donacion.findAll({
      include: [
        { model: Donante },
        { model: Usuario },
        { model: Producto }
      ]
    });
    res.json(donaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerDonacionPorId = async (req, res) => {
  try {
    const donacion = await Donacion.findByPk(req.params.id, {
      include: [
        { model: Donante },
        { model: Usuario },
        { model: Producto }
      ]
    });
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    res.json(donacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearDonacion = async (req, res) => {
  try {
    const { usuario_id, donante_id, cantidad, fecha, productos, nombre_donante, correo_donante, telefono_donante } = req.body;

    let finalDonante_id = donante_id;

    // Si se envían datos del donante, crear o buscar
    if (nombre_donante) {
      const donanteExistente = await Donante.findOne({
        where: { correo: correo_donante || null }
      });

      if (donanteExistente) {
        finalDonante_id = donanteExistente.id;
      } else {
        // Crear nuevo donante
        const nuevoDonante = await Donante.create({
          nombre_completo: nombre_donante,
          correo: correo_donante || null,
          telefono: telefono_donante || null
        });
        finalDonante_id = nuevoDonante.id;
      }
    }
    // Si no hay donante_id ni datos, será una donación anónima (donante_id = null)

    const donacion = await Donacion.create({ usuario_id, donante_id: finalDonante_id, cantidad, fecha });

    if (productos && productos.length > 0) {
      await Promise.all(productos.map(p =>
        DonacionProducto.create({
          donacion_id: donacion.id,
          producto_id: p.producto_id
        })
      ));
    }

    res.status(201).json(donacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findByPk(req.params.id);
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    await donacion.update(req.body);
    res.json(donacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminarDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findByPk(req.params.id);
    if (!donacion) return res.status(404).json({ error: 'Donación no encontrada' });
    await donacion.destroy();
    res.json({ mensaje: 'Donación eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerDonaciones,
  obtenerDonacionPorId,
  crearDonacion,
  actualizarDonacion,
  eliminarDonacion
};