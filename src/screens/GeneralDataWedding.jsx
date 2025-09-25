import { useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "./style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../assets/logoHorizontal.png";

export default function GeneralDataWeddingScreen() {
  const [budget, setBudget] = useState("")
  const [weddingDate, setWeddingDate] = useState("")
  const [guests, setGuests] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      //Verifica se o usuário já tem casamento
      const { data: casamentoExistente, error: casamentoError } = await supabase
      .from("casamento")
      .select("id_casamento, id_orcamento, id_data, id_convidados")
      .eq("id_usuario", user.id)
      .single()

      if(casamentoError && casamentoError.code !== "PGRST116") {        
        throw casamentoError //Código 116 = nenhum resultado
      }

      //Cria ou atualiza orçamento
      let idOrcamento
      if(casamentoExistente?.id_orcamento) {
        const { error } = await supabase
        .from("orcamento")
        .update({ previsao_orcamento: budget })
        .eq("id_orcamento", casamentoExistente.id_orcamento)
        
        if(error) throw error
        
        idOrcamento = casamentoExistente.id_orcamento
      } else {
        const { data, error } = await supabase
        .from("orcamento")
        .insert([{ previsao_orcamento: budget, orcamento_gasto: 0 }])
        .select()
        .single()
        
        if(error) throw error
        
        idOrcamento = data.id_orcamento
      }

      //Cria ou atualiza data
      let idData
      if(casamentoExistente?.id_data) {
        const { error } = await supabase
        .from("datacasamento")
        .update({ data: weddingDate })
        .eq("id_data", casamentoExistente.id_data)
        
        if(error) throw error
        
        idData = casamentoExistente.id_data
      } else {
        const { data, error } = await supabase
        .from("datacasamento")
        .insert([{ data: weddingDate }])
        .select()
        .single()
        
        if(error) throw error
        
        idData = data.id_data
      }

      //Cria ou atualiza convidados
      let idConvidados
      if(casamentoExistente?.id_convidados) {
        const { error } = await supabase
        .from("convidados")
        .update({ quantidade_prevista: guests })
        .eq("id_convidados", casamentoExistente.id_convidados)
        
        if(error) throw error
        
        idConvidados = casamentoExistente.id_convidados
      } else {
        const { data, error } = await supabase
        .from("convidados")
        .insert([{ quantidade_prevista: guests }])
        .select()
        .single()
        
        if(error) throw error
        
        idConvidados = data.id_convidados
      }

      //Atualiza casamento
      if(casamentoExistente) {
        const { error } = await supabase
        .from("casamento")
        .update({
          id_orcamento: idOrcamento,
          id_data: idData,
          id_convidados: idConvidados
        })
        .eq("id_casamento", casamentoExistente.id_casamento)

        if(error) throw error
      } 
      //Cria novo casamento
      else {
        const { error } = await supabase
        .from("casamento")
        .insert([{
          id_usuario: user.id,
          id_orcamento: idOrcamento,
          id_data: idData,
          id_convidados: idConvidados
        }])
        
        if(error) throw error
      }
      setMessage("Informações do casamento salvas com sucesso!")
      navigate("/set/preferences/dress")
    } 
    
    catch(err) {
      setMessage("Erro: " + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="tela">
      <select
        className="idioma"
      >
        <option value="idioma1">Português (Brasil)</option>
      </select>

      <div className="area areaForms">        
        <h3>Que tal nos contar um pouquinho mais sobre seu casamento?</h3>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              className="inputText"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              placeholder=" "
            />
            <label>Até quanto espera gastar?</label>
          </div>
          
          <div className="inputBox">
            <input
              className="inputText"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              required
              placeholder=" "
            />
            <label>Qual a data ideal?</label>
          </div>

          <div className="inputBox">
            <input
              className="inputText"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              required
              placeholder=" "
            />
            <label>Em média, quantos convidados?</label>
          </div>

          <button className="btn btnBg" type="submit">
            {loading ? "Salvando..." : "Salvar informações"}
          </button>
        </form>
      </div>
      <img className="logoHorizontal" src={logoHorizontal} alt="Logo Éden"/>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
