import { useState } from "react"
import { supabase } from "../../../services/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function DreamsIdeasPreferenceScreen() {
  const [dream, setDream] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

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
          .update({ sonhos_ideias: dream })
          .eq("id_preferencias", idPreferencias)

        if (updateError) throw updateError
      } else {
        // Cria se ainda não existir
        const { data: novaPref, error: insertError } = await supabase
          .from("preferencias")
          .insert([{ sonhos_ideias: dream }])
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

      setMessage("✅ Sonho/ideia salvo com sucesso!")

      // 🔹 Redireciona para home
      navigate("/")

    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F8D7C4] p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#A94F1A] text-center mb-6">
          Nos conte, existe algo que você sonhou e não encontrou aqui?
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-sm mx-auto">
          <textarea
            placeholder="Nos diga seu sonho!"
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            className="w-full h-24 p-3 rounded-xl border-2 border-[#A94F1A] text-[#A94F1A] focus:outline-none focus:ring-2 focus:ring-[#A94F1A]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#A94F1A] text-white py-3 rounded-full"
          >
            {loading ? "Salvando..." : "Finalizar"}
          </button>
        </form>
      </div>

      {message && (
        <p className="mt-4 text-center text-[#A94F1A]">{message}</p>
      )}
    </div>
  )
}
