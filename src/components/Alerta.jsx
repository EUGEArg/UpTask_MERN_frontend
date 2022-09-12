

const Alerta = ({alerta}) => {
  return (
    <div className={`${alerta.error ? 'from-red-400 to-red-500': 'from-sky-400 to-sky-500'} bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`}>
        {alerta.msg}
    </div>
  )
}

export default Alerta