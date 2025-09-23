import { useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function GeneralDataWeddingScreen() {
  const [budget, setBudget] = useState("")
  const [weddingDate, setWeddingDate] = useState("")
  const [guests, setGuests] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { data: orcamento, error: errOrcamento } = await supabase
        .from("orcamento")
        .insert([{ previsao_orcamento: budget, orcamento_gasto: 0 }])
        .select()
        .single()
      if (errOrcamento) throw errOrcamento

      const { data: dataCasamento, error: errData } = await supabase
        .from("datacasamento")
        .insert([{ data: weddingDate }])
        .select()
        .single()
      if (errData) throw errData

      const { data: convidados, error: errConvidados } = await supabase
        .from("convidados")
        .insert([{ quantidade_prevista: guests }])
        .select()
        .single()
      if (errConvidados) throw errConvidados

      const { error: errCasamento } = await supabase
        .from("casamento")
        .insert([{
          id_usuario: user.id,
          id_orcamento: orcamento.id_orcamento,
          id_data: dataCasamento.id_data,
          id_convidados: convidados.id_convidados
        }])
      if (errCasamento) throw errCasamento

      setMessage("✅ Informações do casamento salvas com sucesso!")
      setBudget("")
      setWeddingDate("")
      setGuests("")

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
        <button className="" type="submit" disabled={loading} style={{ padding: 10, width: "100%" }}>
          {loading ? "Salvando..." : "Salvar informações"}
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
