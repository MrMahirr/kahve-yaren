export type StoryStep = {
  no: string
  title: string
  text: string
}

/** Hikâye bölümü: telve parçacıkları her adımda yeni bir biçime girer. */
export const STORY_STEPS: StoryStep[] = [
  {
    no: '01',
    title: 'Çekirdek',
    text: 'Her şey tek bir çekirdekle başlar. Küçük partiler halinde, her demleme yöntemi için ayrı ayrı kavrulur.',
  },
  {
    no: '02',
    title: 'Öğütme',
    text: 'Türk kahvesi için un kadar ince, filtre için deniz kumu kadar iri. Öğütme, demlemenin yarısıdır.',
  },
  {
    no: '03',
    title: 'Köpük',
    text: 'Kısık ateş, sabır ve doğru anda alınan köpük. Telve dibe çöker, hikâye fincanın üstünde kalır.',
  },
  {
    no: '04',
    title: 'Yâren',
    text: 'Cezvenin sabrı espressonun hızıyla aynı masada. Sade bir mekân, iyi bir fincan ve acele etmeyen bir sohbet.',
  },
]
