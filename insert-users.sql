DECLARE @now datetime2 = SYSUTCDATETIME();
-- Senha padrao (BCrypt): 123456

INSERT INTO Users (
  Name,
  Email,
  Department,
  Status,
  HasAccess,
  PasswordHash,
  Profile,
  CreatedAt
)
VALUES
(
  N'Alex Wallau',
  N'awallau@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Alexsandro Soares',
  N'aslima@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Aline Moreira',
  N'amoreira@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Amanda Monteiro',
  N'amonteiro@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Andre Rodrigues de Souza',
  N'arsouza@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Arthur de Lima Muniz',
  N'amuniz@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Arthur Souza',
  N'asouza@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Beatriz Ribeiro Cardoso Nascimento',
  N'bnascimento@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Brenno Silva',
  N'bpsilva@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Carla de Oliveira',
  N'clufti@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Caroline Hahne',
  N'cnhahne@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Daniel Marcondes',
  N'dmarcondes@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Daniel Oliveira',
  N'doliveira@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Daniel Thalys Fagundes Oliveira',
  N'dthalys@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Debora Ramos',
  N'dramos@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Diana Siqueira',
  N'dsiqueira@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Eric Nahas',
  N'enahas@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Erica Guedes',
  N'eguedes@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Ivaldo Fernandes',
  N'ivaldo.fernandes@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Jefferson Piedade',
  N'jefferson.piedade@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Jeffersonn Rodrigues da Costa Precioso',
  N'jeffersonn.precioso@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Jose Mario',
  N'jose.mario@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Kayky Santos',
  N'kayky.santos@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Kaylane da Silva',
  N'kaylane.silva@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Leonardo Zungalo Quintal',
  N'leonardo.quintal@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Leticia Oliveira',
  N'leticia.oliveira@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Mackson Roberto Santos da Silva',
  N'mackson.silva@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Marcella Costa Tavares',
  N'marcella.tavares@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Marcia Angelini',
  N'marcia.angelini@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Marcos do Valle',
  N'marcos.valle@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Mariana Tavares',
  N'mariana.tavares@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Milton Honorato',
  N'milton.honorato@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Newton Iraha',
  N'newton.iraha@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Paulo Roberto de Carvalho Filho',
  N'paulo.filho@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Rafael Kioshi Ueda',
  N'rafael.ueda@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Renato Martins',
  N'renato.martins@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Rodrigo Jorge dos Santos Arruda',
  N'rodrigo.arruda@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Thaina Barbosa Eleuterio',
  N'thaina.eleuterio@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Thiago Pereira',
  N'thiago.pereira@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Valmir Santos da Silva',
  N'valmir.silva@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Vander Serra de Abreu',
  N'vander.abreu@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
),
(
  N'Vanilton Sergio de Andrade Silva',
  N'vanilton.silva@iportsolutions.com.br',
  2,
  1,
  1,
  N'$2a$11$xnO/SVdlaazFJVskn16t6ObI2v6fvQK9u/0nfvjgACC5Oio2J/Hca',
  N'Leitor',
  @now
);