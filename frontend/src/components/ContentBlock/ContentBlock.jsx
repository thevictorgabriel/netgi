import styles from './ContentBlock.module.css';

export function ContentBlock({ title, description, image, icon, reverse }) {
  // A prop 'reverse' inverte a ordem da imagem/texto para variar o layout
  return (
    <section className={`${styles.block} ${reverse ? styles.reverse : ''}`}>
      {/* Renderiza a área visual se houver imagem ou ícone */}
      {(image || icon) && (
        <div className={styles.visuals}>
          {image && <img src={image} alt={title} className={styles.mainImage} />}
          {icon && <img src={icon} alt="" className={styles.icon} />}
        </div>
      )}
      
      {/* Renderiza os textos */}
      <div className={styles.textData}>
        {title && <h2>{title}</h2>}
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}