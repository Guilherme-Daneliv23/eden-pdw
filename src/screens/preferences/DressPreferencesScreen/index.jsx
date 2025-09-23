import { useState } from "react"
import { supabase } from "../../../services/supabaseClient"

export default function DressPreferencesScreen() {
  const options = [
    "Princesa",
    "Sereia",
    "Curto",
    "Mid",
    "Minimalista",
    "Boho",
    "Feito sob medida",
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { data, error } = await supabase
        .from("preferencias")
        .insert([{ vestido: selectedOptions }])
        .select()
        .single()

      if (error) throw error

      await supabase
        .from("casamento")
        .update({ id_preferencias: data.id_preferencias })
        .eq("id_usuario", user.id)

      setMessage("✅ Preferências de vestido salvas!")
    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Para você, como seria “O vestido ideal”?</h2>
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
