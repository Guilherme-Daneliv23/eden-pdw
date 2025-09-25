import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "../style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../../assets/logoHorizontal.png";

export default function DreamScenarioPreferencesScreen() {
  const options = [
    "Igreja (Tradicional)",
    "Praia",
    "Jardim",
    "Campo",
    "Salão de festas",
    "Chácara",
    "Outro"
  ]

  const [selectedOptions, setSelectedOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

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
      // pega usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // busca casamento do usuário
      const { data: casamento, error: casamentoError } = await supabase
        .from("casamento")
        .select("id_casamento, id_preferencias")
        .eq("id_usuario", user.id)
        .single()

      if (casamentoError || !casamento) throw new Error("Casamento não encontrado")

      let idPreferencias = casamento.id_preferencias

      if (idPreferencias) {
        // se já existe, atualiza
        const { error: updateError } = await supabase
          .from("preferencias")
          .update({ local: selectedOptions })
          .eq("id_preferencias", idPreferencias)

        if (updateError) throw updateError
      } else {
        // se não existe, cria
        const { data: novaPref, error: insertError } = await supabase
          .from("preferencias")
          .insert([{ local: selectedOptions }])
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

      setMessage("✅ Cenário dos sonhos salvo com sucesso!")

      // 🔹 Redireciona para a próxima tela
      navigate("/set/preferences/decoration")

    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="tela">
      <h2>Qual seria o cenário dos seus sonhos?</h2>
      <form onSubmit={handleSubmit}>
        {options.map((option) => (
          <div key={option}>
            <label className="labelCheckbox">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleToggle(option)}
                className="checkbox"
              />
              {" "}{option}
            </label>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="btn btnBg"
        >
          {loading ? "Salvando..." : "Salvar preferências"}
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
