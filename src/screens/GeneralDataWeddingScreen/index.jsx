import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"

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

      // 🔹 Verifica se o usuário já tem casamento
      const { data: casamentoExistente, error: casamentoError } = await supabase
        .from("casamento")
        .select("id_casamento, id_orcamento, id_data, id_convidados")
        .eq("id_usuario", user.id)
        .single()

      if (casamentoError && casamentoError.code !== "PGRST116") { 
        // código 116 = nenhum resultado
        throw casamentoError
      }

      // 🔹 Cria ou atualiza orçamento
      let idOrcamento
      if (casamentoExistente?.id_orcamento) {
        const { error } = await supabase
          .from("orcamento")
          .update({ previsao_orcamento: budget })
          .eq("id_orcamento", casamentoExistente.id_orcamento)
        if (error) throw error
        idOrcamento = casamentoExistente.id_orcamento
      } else {
        const { data, error } = await supabase
          .from("orcamento")
          .insert([{ previsao_orcamento: budget, orcamento_gasto: 0 }])
          .select()
          .single()
        if (error) throw error
        idOrcamento = data.id_orcamento
      }

      // 🔹 Cria ou atualiza data
      let idData
      if (casamentoExistente?.id_data) {
        const { error } = await supabase
          .from("datacasamento")
          .update({ data: weddingDate })
          .eq("id_data", casamentoExistente.id_data)
        if (error) throw error
        idData = casamentoExistente.id_data
      } else {
        const { data, error } = await supabase
          .from("datacasamento")
          .insert([{ data: weddingDate }])
          .select()
          .single()
        if (error) throw error
        idData = data.id_data
      }

      // 🔹 Cria ou atualiza convidados
      let idConvidados
      if (casamentoExistente?.id_convidados) {
        const { error } = await supabase
          .from("convidados")
          .update({ quantidade_prevista: guests })
          .eq("id_convidados", casamentoExistente.id_convidados)
        if (error) throw error
        idConvidados = casamentoExistente.id_convidados
      } else {
        const { data, error } = await supabase
          .from("convidados")
          .insert([{ quantidade_prevista: guests }])
          .select()
          .single()
        if (error) throw error
        idConvidados = data.id_convidados
      }

      if (casamentoExistente) {
        // 🔹 Atualiza casamento
        const { error } = await supabase
          .from("casamento")
          .update({
            id_orcamento: idOrcamento,
            id_data: idData,
            id_convidados: idConvidados
          })
          .eq("id_casamento", casamentoExistente.id_casamento)

        if (error) throw error
      } else {
        // 🔹 Cria novo casamento
        const { error } = await supabase
          .from("casamento")
          .insert([{
            id_usuario: user.id,
            id_orcamento: idOrcamento,
            id_data: idData,
            id_convidados: idConvidados
          }])
        if (error) throw error
      }

      setMessage("✅ Informações do casamento salvas com sucesso!")
      navigate("/set/preferences/dress")

    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Planejamento do Casamento</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Até quanto espera gastar?</label><br />
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Qual a data ideal?</label><br />
          <input
            type="date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Em média, quantos convidados?</label><br />
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: 10, width: "100%" }}>
          {loading ? "Salvando..." : "Salvar informações"}
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
