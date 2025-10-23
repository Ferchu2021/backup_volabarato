import { Router, Request, Response } from 'express';
import { Paquete, paqueteJoiSchema, ICreatePaqueteRequest, IUpdatePaqueteRequest } from '../models/Paquete';
import { auth } from '../middlewares/auth';

const router = Router();

// GET /api/paquete - Obtener todos los paquetes activos
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const paquetes = await Paquete.find({ activo: true }).sort({ fecha: 1 });
    res.json(paquetes);
  } catch (error) {
    console.error('Error al obtener paquetes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/paquete - Crear nuevo paquete (requiere autenticación)
router.post('/', auth, async (req: Request<{}, {}, ICreatePaqueteRequest>, res: Response): Promise<void> => {
  try {
    const { error } = paqueteJoiSchema.validate(req.body);
    if (error) {
      res.status(400).json({ 
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación' 
      });
      return;
    }

    const paquete = new Paquete(req.body);
    await paquete.save();
    
    res.status(201).json({
      message: 'Paquete creado exitosamente',
      paquete
    });
  } catch (error) {
    console.error('Error al crear paquete:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/paquete/:id - Actualizar paquete (requiere autenticación)
router.put('/:id', auth, async (req: Request<{ id: string }, {}, IUpdatePaqueteRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'ID del paquete es requerido' });
      return;
    }

    const { error } = paqueteJoiSchema.validate(req.body);
    if (error) {
      res.status(400).json({ 
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación' 
      });
      return;
    }

    const paquete = await Paquete.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!paquete) {
      res.status(404).json({ error: 'Paquete no encontrado' });
      return;
    }

    res.json({
      message: 'Paquete actualizado exitosamente',
      paquete
    });
  } catch (error) {
    console.error('Error al actualizar paquete:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/paquete/:id - Eliminar paquete (baja lógica, requiere autenticación)
router.delete('/:id', auth, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'ID del paquete es requerido' });
      return;
    }

    const paquete = await Paquete.findByIdAndUpdate(
      id, 
      { activo: false }, 
      { new: true }
    );

    if (!paquete) {
      res.status(404).json({ error: 'Paquete no encontrado' });
      return;
    }

    res.status(200).json({ 
      message: 'Paquete eliminado exitosamente (baja lógica)',
      paquete 
    });
  } catch (error) {
    console.error('Error al eliminar paquete:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/paquete/:id - Obtener paquete por ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'ID del paquete es requerido' });
      return;
    }

    const paquete = await Paquete.findById(id);

    if (!paquete) {
      res.status(404).json({ error: 'Paquete no encontrado' });
      return;
    }

    if (!paquete.activo) {
      res.status(404).json({ error: 'Paquete no disponible' });
      return;
    }

    res.json(paquete);
  } catch (error) {
    console.error('Error al obtener paquete:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
