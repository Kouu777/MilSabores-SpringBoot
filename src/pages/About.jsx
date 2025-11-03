import hero from "../assets/images/hero-image.jpg";
import corazonLineart from "../assets/images/corazon-lineart.svg";

export default function About() {
  return (
    <section
      className="min-h-screen bg-cafe-claro flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-4xl mx-auto bg-cafe-claro/90 text-cafe-oscuro rounded-3xl p-8 md:p-12 shadow-2xl border-1 border-cafe-oscuro">
        <h1 className="font-subtitulo text-5xl md:text-6xl text-center mb-8">
          Sobre Nosotros
        </h1>
        <div className="font-texto text-lg space-y-6 text-justify">
          <p>
            Mil Sabores es una pastelería artesanal ubicada en el corazón de
            Santiago de Chile. Nacimos con una idea simple: convertir
            ingredientes nobles en momentos memorables. Cada día elaboramos
            nuestras tortas y postres a mano, sin premezclas, utilizando
            mantequilla de verdad, frutas de estación y chocolate de calidad,
            privilegiando a productores locales.
          </p>
          <p>
            Nos apasiona la tradición y también la creatividad. Desde nuestras
            clásicas tortas de mil hojas con manjar casero, tres leches y
            hojarasca, hasta opciones contemporáneas como cheesecakes,
            tartaletas y macarons. También ofrecemos alternativas veganas, sin
            gluten y sin azúcar, para que nadie se quede sin celebrar.
          </p>
          <p>
            Diseñamos tortas a medida con el sabor y el estilo que imaginas
            —para cumpleaños, matrimonios, baby showers y eventos corporativos—.
            Nuestro equipo te acompaña en cada paso para que tu pedido sea tan
            único como tu ocasión. Si buscas un detalle dulce para el día a día
            o un centro de mesa inolvidable, estamos aquí para ayudarte a
            encontrar ese sabor que te sorprenda.
          </p>
        </div>
        <img
          src={corazonLineart}
          alt="Corazón decorativo"
          className="mx-auto mt-8 w-52 caret-cafe-oscuro"
        />
      </div>
    </section>
  );
}
