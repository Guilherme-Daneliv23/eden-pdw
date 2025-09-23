import { useState } from "react"
import { supabase } from "../../../services/supabaseClient"

export default function PartyPreferencesScreen() {
  const options = [
    "Banda ao vivo",
    "DJ",
    "Música ambiente tranquila",
    "Playlist personalizada",
    "Outro"
  ]

  const [selectedOptions, setSelectedOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleToggle = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // 1. pega o usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // 2. busca o casamento vinculado a esse usuário
      const { data: casamento, error: casamentoError } = await supabase
        .from("casamento")
        .select("id_casamento, id_preferencias")
        .eq("id_usuario", user.id)
        .single()

      if (casamentoError || !casamento) throw new Error("Casamento não encontrado")

      let idPreferencias = casamento.id_preferencias

      if (idPreferencias) {
        // 3a. se já existe, atualiza
        const { error: updateError } = await supabase
          .from("preferencias")
          .update({ musica_festa: selectedOptions })
          .eq("id_preferencias", idPreferencias)

        if (updateError) throw updateError
      } else {
        // 3b. se não existe, cria e vincula ao casamento
        const { data: novaPref, error: insertError } = await supabase
          .from("preferencias")
          .insert([{ musica_festa: selectedOptions }])
          .select("id_preferencias")
          .single()

        if (insertError) throw insertError

        idPreferencias = novaPref.id_preferencias

        // vincula a nova preferência ao casamento
        const { error: linkError } = await supabase
          .from("casamento")
          .update({ id_preferencias: idPreferencias })
          .eq("id_casamento", casamento.id_casamento)

        if (linkError) throw linkError
      }

      setMessage("✅ Preferências de festa salvas com sucesso!")
    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Como gostariam que fosse a alma da festa?</h2>
      <form onSubmit={handleSubmit}>
        {options.map((option) => (
          <div key={option} style={{ marginBottom: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleToggle(option)}
              />
              {" "}{option}
            </label>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, width: "100%", marginTop: 20 }}
        >
          {loading ? "Salvando..." : "Salvar preferências"}
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
