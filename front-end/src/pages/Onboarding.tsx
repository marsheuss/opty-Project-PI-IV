import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Tag,
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Book,
  Sparkles,
  Gamepad2,
  Package,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import ProgressBar from '@/components/ProgressBar';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    categories: [] as string[],
    priceRange: '',
    preferences: [] as string[],
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    { id: 'electronics', name: 'Eletrônicos', icon: Smartphone },
    { id: 'fashion', name: 'Moda e Vestuário', icon: Shirt },
    { id: 'home', name: 'Casa e Decoração', icon: Home },
    { id: 'sports', name: 'Esportes e Fitness', icon: Dumbbell },
    { id: 'books', name: 'Livros e Mídia', icon: Book },
    { id: 'beauty', name: 'Beleza e Cuidados', icon: Sparkles },
    { id: 'games', name: 'Games e Consoles', icon: Gamepad2 },
    { id: 'others', name: 'Outros', icon: Package },
  ];

  const priceRanges = [
    { value: '0-100', label: 'Até R$ 100' },
    { value: '100-500', label: 'R$ 100 - R$ 500' },
    { value: '500-1500', label: 'R$ 500 - R$ 1.500' },
    { value: '1500-5000', label: 'R$ 1.500 - R$ 5.000' },
    { value: '5000+', label: 'Acima de R$ 5.000' },
  ];

  const preferences = [
    { id: 'best-price', label: 'Priorizo o menor preço' },
    { id: 'brands', label: 'Valorizo marcas conhecidas' },
    { id: 'free-shipping', label: 'Prefiro frete grátis' },
    { id: 'cashback', label: 'Gosto de cashback e cupons' },
    { id: 'installments', label: 'Compro parcelado' },
    { id: 'reputation', label: 'Prefiro lojas com boa reputação' },
  ];

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const togglePreference = (prefId: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter((id) => id !== prefId)
        : [...prev.preferences, prefId],
    }));
  };

  const handleNext = () => {
    if (currentStep === 2 && formData.categories.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Selecione pelo menos uma categoria para continuar.',
        variant: 'destructive',
      });
      return;
    }

    if (currentStep === 3 && !formData.priceRange) {
      toast({
        title: 'Atenção',
        description: 'Selecione uma faixa de preço para continuar.',
        variant: 'destructive',
      });
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: 'Perfil configurado!',
      description: 'Bem-vindo ao Opty. Vamos começar a economizar!',
    });
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-subtle'>
      <div className='w-full max-w-3xl animate-fade-in'>
        {/* Logo */}
        <Link to='/' className='flex items-center justify-center gap-2 mb-8 group'>
          <div className='bg-gradient-primary p-2 rounded-lg shadow-md group-hover:shadow-glow transition-all duration-300'>
            <Tag className='h-6 w-6 text-white' />
          </div>
          <span className='text-2xl font-bold gradient-text'>Opty</span>
        </Link>

        <Card className='glass shadow-xl border-2'>
          <CardHeader className='pb-4'>
            <ProgressBar currentStep={currentStep} totalSteps={5} />
          </CardHeader>

          <CardContent className='min-h-[400px] flex flex-col'>
            {/* Step 1 - Welcome */}
            {currentStep === 1 && (
              <div className='flex-1 flex flex-col items-center justify-center text-center animate-fade-in'>
                <div className='w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-6 shadow-glow'>
                  <Sparkles className='h-10 w-10 text-white' />
                </div>
                <CardTitle className='text-3xl mb-4'>Bem-vindo ao Opty! 🎉</CardTitle>
                <CardDescription className='text-lg max-w-md'>
                  Vamos conhecer você melhor para personalizar sua experiência de compras
                </CardDescription>
                <Button onClick={handleNext} variant='gradient' size='xl' className='mt-8'>
                  Começar
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </div>
            )}

            {/* Step 2 - Categories */}
            {currentStep === 2 && (
              <div className='flex-1 flex flex-col animate-fade-in'>
                <div className='text-center mb-6'>
                  <CardTitle className='text-2xl mb-2'>O que você mais compra online?</CardTitle>
                  <CardDescription>Selecione suas categorias favoritas</CardDescription>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                  {categories.map((category) => {
                    const isSelected = formData.categories.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`p-4 rounded-xl border-2 transition-all hover-lift ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border bg-background hover:border-primary/30'
                        }`}
                      >
                        <category.icon
                          className={`h-8 w-8 mx-auto mb-2 ${
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                        <div
                          className={`text-sm font-medium ${
                            isSelected ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {category.name}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className='flex justify-between mt-auto'>
                  <Button onClick={handleBack} variant='ghost'>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} variant='gradient'>
                    Próximo
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 - Price Range */}
            {currentStep === 3 && (
              <div className='flex-1 flex flex-col animate-fade-in'>
                <div className='text-center mb-8'>
                  <CardTitle className='text-2xl mb-2'>Qual sua faixa de preço habitual?</CardTitle>
                  <CardDescription>Isso nos ajuda a mostrar produtos relevantes</CardDescription>
                </div>

                <RadioGroup
                  value={formData.priceRange}
                  onValueChange={(value) => setFormData({ ...formData, priceRange: value })}
                  className='space-y-3 mb-6'
                >
                  {priceRanges.map((range) => (
                    <div
                      key={range.value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                        formData.priceRange === range.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                      onClick={() => setFormData({ ...formData, priceRange: range.value })}
                    >
                      <RadioGroupItem value={range.value} id={range.value} />
                      <Label htmlFor={range.value} className='flex-1 cursor-pointer font-medium'>
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className='flex justify-between mt-auto'>
                  <Button onClick={handleBack} variant='ghost'>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} variant='gradient'>
                    Próximo
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4 - Preferences */}
            {currentStep === 4 && (
              <div className='flex-1 flex flex-col animate-fade-in'>
                <div className='text-center mb-8'>
                  <CardTitle className='text-2xl mb-2'>Como você gosta de comprar?</CardTitle>
                  <CardDescription>Marque todas que se aplicam</CardDescription>
                </div>

                <div className='space-y-3 mb-6'>
                  {preferences.map((pref) => (
                    <div
                      key={pref.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                        formData.preferences.includes(pref.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                      onClick={() => togglePreference(pref.id)}
                    >
                      <Checkbox
                        id={pref.id}
                        checked={formData.preferences.includes(pref.id)}
                        onCheckedChange={() => togglePreference(pref.id)}
                      />
                      <Label htmlFor={pref.id} className='flex-1 cursor-pointer font-medium'>
                        {pref.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className='flex justify-between mt-auto'>
                  <Button onClick={handleBack} variant='ghost'>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} variant='gradient'>
                    Próximo
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5 - Completion */}
            {currentStep === 5 && (
              <div className='flex-1 flex flex-col items-center justify-center text-center animate-fade-in'>
                <div className='w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6 shadow-glow animate-scale-in'>
                  <Check className='h-12 w-12 text-white' />
                </div>
                <CardTitle className='text-3xl mb-4'>Tudo pronto! ✅</CardTitle>
                <CardDescription className='text-lg max-w-md mb-8'>
                  Sua experiência personalizada está configurada. Agora você pode começar a encontrar
                  as melhores ofertas!
                </CardDescription>

                <div className='flex flex-col sm:flex-row gap-3'>
                  <Button onClick={handleBack} variant='outline' size='lg'>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Revisar
                  </Button>
                  <Button onClick={handleComplete} variant='gradient' size='xl'>
                    Começar a Economizar
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
