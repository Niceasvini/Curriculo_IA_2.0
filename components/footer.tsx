export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-red-700 to-amber-600 rounded-full"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Viana e Moura Construções. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex gap-6">
            <a
              href="mailto:contato@vianamoura.com"
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:underline transition-colors"
            >
              Contato
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:underline transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:underline transition-colors"
            >
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
