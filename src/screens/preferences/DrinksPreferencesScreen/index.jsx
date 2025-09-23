import { useState } from "react"
import { supabase } from "../../../services/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function DrinksPreferencesScreen() {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const options = [
    "Bebidas não alcoólicas",
    "Bebidas alcoólicas",
    "Open bar completo",
    "Bar de drinks personalizados",
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
      // 1. Pega usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // 2. Busca casamento
      const { data: casamento, error: casamentoError } = await supabase
        .from("casamento")
        .select("id_casamento, id_preferencias")
        .eq("id_usuario", user.id)
        .single()

      if (casamentoError || !casamento) throw new Error("Casamento não encontrado")

      let idPreferencias = casamento.id_preferencias

      if (idPreferencias) {
        // 3a. Atualiza preferências se já existir
        const { error: updateError } = await supabase
          .from("preferencias")
          .update({ bebidas: selectedOptions })
          .eq("id_preferencias", idPreferencias)

        if (updateError) throw updateError
      } else {
        // 3b. Cria preferências se ainda não existir
        const { data: novaPref, error: insertError } = await supabase
          .from("preferencias")
          .insert([{ bebidas: selectedOptions }])
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

      setMessage("✅ Preferências de bebidas salvas com sucesso!")

      // 🔹 Redireciona para a próxima tela
      navigate("/set/preferences/extra-services")

    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">
        E quanto às bebidas, o que gostaria de fazer?
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => toggleOption(option)}
              className="w-4 h-4 text-pink-500 border-gray-300 rounded"
            />
            <span>{option}</span>
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-pink-600 text-white py-3 rounded-xl"
        >
          {loading ? "Salvando..." : "Salvar preferências"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  )
}
