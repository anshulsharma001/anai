import cream from '../assets/images/brand/logo-cream.webp'
import brown from '../assets/images/brand/logo-brown.webp'
import amber from '../assets/images/brand/logo-amber.webp'
import manifest from '../data/imageManifest.json'

const variants = { cream, brown, amber }
const { width, height } = manifest['brand/logo']

// The original catalogue wordmark, recoloured to the brand palette.
export default function Logo({ variant = 'brown', className = '', alt = 'Anai Foods & Agro Pvt. Ltd.' }) {
  return <img src={variants[variant]} width={width} height={height} alt={alt} decoding="async" className={className} />
}
