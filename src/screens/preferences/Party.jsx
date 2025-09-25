import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "../style.css";
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../../assets/logoHorizontal.png";

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

      // 🔹 redireciona para próxima tela
      navigate("/set/preferences/gastronomy-type")

    } catch (err) {
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

      <div className="areaForms">        
        <h2>Como gostariam que fosse a alma da festa?</h2>
        <form onSubmit={handleSubmit}>
          {options.map((option) => (
            <div key={option}>
              <label className="labelCheckbox">
                <input className="checkbox"
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
            className="btn btnBg"
          >
            {loading ? "Salvando..." : "Salvar preferências"}
          </button>
        </form>
      </div>
      <img className="logoHorizontal" src={logoHorizontal} alt="Logo Éden"/>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
