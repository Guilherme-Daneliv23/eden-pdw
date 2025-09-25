import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "../style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../../assets/logoHorizontal.png";

export default function GastronomyTypePreferenceScreen() {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const options = [
    "Buffet (Tradicional)",
    "Jantar à mesa",
    "Finger foods",
    "Coquetel volante",
    "Food trucks",
    "Outro",
  ]

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // 1. pega usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // 2. busca casamento desse usuário
      const { data: casamento, error: casamentoError } = await supabase
        .from("casamento")
        .select("id_casamento, id_preferencias")
        .eq("id_usuario", user.id)
        .single()

      if (casamentoError || !casamento) throw new Error("Casamento não encontrado")

      let idPreferencias = casamento.id_preferencias

      if (idPreferencias) {
        // Atualiza se já existir
        const { error: updateError } = await supabase
          .from("preferencias")
          .update({ gastronomia_tipo: selectedOptions })
          .eq("id_preferencias", idPreferencias)

        if (updateError) throw updateError
      } else {
        // Cria se não existir
        const { data: novaPref, error: insertError } = await supabase
          .from("preferencias")
          .insert([{ gastronomia_tipo: selectedOptions }])
          .select("id_preferencias")
          .single()

        if (insertError) throw insertError

        idPreferencias = novaPref.id_preferencias

        // Vincula ao casamento
        const { error: linkError } = await supabase
          .from("casamento")
          .update({ id_preferencias: idPreferencias })
          .eq("id_casamento", casamento.id_casamento)

        if (linkError) throw linkError
      }

      setMessage("Preferências de gastronomia salvas com sucesso!")

      // 🔹 Redireciona para próxima tela
      navigate("/set/preferences/gastronomy-main-options")

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
        <h2>
          Qual a melhor maneira de aproveitar uma boa comida?
        </h2>

        <form onSubmit={handleSubmit}>
          {options.map((option) => (
            <label key={option} className="labelCheckbox">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
                className="checkbox"
              />
              <span>{option}</span>
            </label>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="btn btnBg"
          >
            {loading ? "Salvando..." : "Continuar"}
          </button>
        </form>
      </div>
      <img className="logoHorizontal" src={logoHorizontal} alt="Logo Éden"/>

      {message && (
        <p className="mt-4 text-center text-[#A94F1A]">{message}</p>
      )}
    </div>
  )
}
