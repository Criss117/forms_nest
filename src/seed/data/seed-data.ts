export interface SeedTypes {
  id: number;
  name: string;
  description: string;
}

export interface SeedSubTypes {
  id: number;
  name: string;
  description: string;
  type: {
    id: number;
  };
}

export interface SeedUsers {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  token: string;
  confirm: boolean;
}

export const initialUsers: SeedUsers[] = [
  {
    id: 1,
    name: 'admin',
    surname: 'admin',
    phone: '123456789',
    email: 'admin@email.com',
    password: 'HolaMundo123',
    token: '',
    confirm: true,
  },
  {
    id: 2,
    name: 'sary',
    surname: 'yineth',
    phone: '123456789',
    email: 'sary@email.com',
    password: 'HolaMundo123',
    confirm: true,
    token: '',
  },
];

export const initialTypes: SeedTypes[] = [
  {
    id: 1,
    name: 'Elección única',
    description:
      'Un campo de elección única te permite seleccionar una única opción entre varias posibles. Simplemente haz clic o marca la respuesta que prefieras, y solo se registrará esa elección. ',
  },
  {
    id: 2,
    name: 'Elección múltiple',
    description:
      'Un campo de elección múltiple te permite seleccionar varias opciones de una lista al mismo tiempo.',
  },
  {
    id: 3,
    name: 'Respuesta abierta',
    description:
      'Un campo de respuesta abierta te permite escribir o ingresar libremente tu propia respuesta en lugar de elegir entre opciones predefinidas.',
  },
  {
    id: 4,
    name: 'Escalas',
    description:
      'Esta escala permite a los encuestados expresar su nivel de acuerdo/desacuerdo o satisfacción en una serie de opciones.',
  },
];

export const initialSubTypes: SeedSubTypes[] = [
  {
    id: 1,
    name: 'Elección única',
    description: 'Las opciones se muestran una tras otra',
    type: {
      id: 1,
    },
  },
  {
    id: 2,
    name: 'Desplegable',
    description:
      'Útil cuando tienes varias opciones pero deseas conservar un diseño limpio y compacto en tu formulario',
    type: {
      id: 1,
    },
  },
  {
    id: 3,
    name: 'Elección múltiple',
    description: 'Las opciones se muestran una tras otra',
    type: {
      id: 2,
    },
  },
  {
    id: 4,
    name: 'Desplegable',
    description:
      'Útil cuando tienes varias opciones pero deseas conservar un diseño limpio y compacto en tu formulario',
    type: {
      id: 2,
    },
  },
  {
    id: 5,
    name: 'Comentario',
    description:
      'Un campo de comentario de varias líneas es un espacio en el que los usuarios pueden proporcionar comentarios o explicaciones más extensas y detalladas.',
    type: {
      id: 3,
    },
  },
  {
    id: 6,
    name: 'Vario cuadros de texto',
    description:
      'Útil cuando tienes varias opciones pero deseas conservar un diseño limpio y compacto en tu formulario',
    type: {
      id: 3,
    },
  },
  {
    id: 7,
    name: 'Escala de opinión',
    description:
      'La escala de opinión te permite expresar tu grado de acuerdo o desacuerdo con una declaración.',
    type: {
      id: 4,
    },
  },
  {
    id: 8,
    name: 'Escala visual',
    description: 'Elige ente corazones, extrellas, etc, para tu escala',
    type: {
      id: 4,
    },
  },
  {
    id: 9,
    name: 'Escala deslizable',
    description:
      'Permite seleccionar un valor o posición en una escala moviendo un control deslizante gráfico a lo largo de una línea.',
    type: {
      id: 4,
    },
  },
];
