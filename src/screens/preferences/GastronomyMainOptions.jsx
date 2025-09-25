import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "../style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../../assets/logoHorizontal.png";

export default function GastronomyMainOptionsPreferencesScreen() {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const options = [
    "Massas",
    "Churrasco",
    "Frutos do mar",
    "Opções vegetarianas",
    "Opções veganas",
    "Comida regional típica",
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

      // 2. busca casamento do usuário
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
          .update({ gastronomia_opcao_principal: selectedOptions })
          .eq("id_preferencias", idPreferencias)

        if (updateError) throw updateError
      } else {
        // Cria se ainda não existir
        const { data: novaPref, error: insertError } = await supabase
          .from("preferencias")
          .insert([{ gastronomia_opcao_principal: selectedOptions }])
          .select("id_preferencias")
          .single()

        if (insertError) throw insertError

        idPreferencias = novaPref.id_preferencias

        // vincula ao casamento
        const { error: linkError } = await supabase
          .from("casamento")
          .update({ id_preferencias: idPreferencias })
          .eq("id_casamento", casamento.id_casamento)

        if (linkError) throw linkError
      }

      setMessage("Opções principais de gastronomia salvas com sucesso!")

      // 🔹 Redireciona para próxima tela
      navigate("/set/preferences/gastronomy-cake")

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

      <div className="area">
        <h3 className="w-65">O que não pode faltar no cardápio?</h3>

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
