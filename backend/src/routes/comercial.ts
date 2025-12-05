import { Router } from 'express'
import ComercialController from '../controllers/ComercialController'


const comercial = Router()

comercial.post('/agendamento', ComercialController.createAgendamento.bind(ComercialController))
comercial.get('/disponibilidade', ComercialController.checkDisponibilidade.bind(ComercialController))
comercial.get('/agendamentos/:data', ComercialController.getAgendamentosByData.bind(ComercialController))

export default comercial
