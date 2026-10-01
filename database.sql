DROP TABLE IF EXISTS consultas CASCADE;
DROP TABLE IF EXISTS disponibilidades CASCADE;
DROP TABLE IF EXISTS dentista_procedimentos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS procedimentos CASCADE;
DROP TABLE IF EXISTS dentistas CASCADE;

-- =========================================
-- DENTISTAS
-- =========================================

CREATE TABLE dentistas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100),
    telefone VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);


-- =========================================
-- PACIENTES
-- =========================================

CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(150) UNIQUE
);


-- =========================================
-- PROCEDIMENTOS
-- =========================================

CREATE TABLE procedimentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    duracao_minutos INTEGER NOT NULL CHECK (duracao_minutos > 0),
    preco DECIMAL(10, 2) CHECK (preco IS NULL OR preco >= 0),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);


-- =========================================
-- DENTISTA <-> PROCEDIMENTO
-- =========================================

CREATE TABLE dentista_procedimentos (
    dentista_id INTEGER NOT NULL,
    procedimento_id INTEGER NOT NULL,

    PRIMARY KEY (dentista_id, procedimento_id),

    FOREIGN KEY (dentista_id)
        REFERENCES dentistas(id)
        ON DELETE CASCADE,

    FOREIGN KEY (procedimento_id)
        REFERENCES procedimentos(id)
        ON DELETE CASCADE
);


-- =========================================
-- DISPONIBILIDADE DOS DENTISTAS
-- =========================================

CREATE TABLE disponibilidades (
    id SERIAL PRIMARY KEY,
    dentista_id INTEGER NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,

    CHECK (hora_fim > hora_inicio),

    FOREIGN KEY (dentista_id)
        REFERENCES dentistas(id)
        ON DELETE CASCADE
);


-- =========================================
-- CONSULTAS
-- =========================================

CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,

    paciente_id INTEGER NOT NULL,
    dentista_id INTEGER NOT NULL,
    procedimento_id INTEGER NOT NULL,

    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'agendada',
    observacao TEXT,

    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (data_hora_fim > data_hora_inicio),
    CHECK (status IN ('agendada', 'cancelada', 'concluida')),

    FOREIGN KEY (paciente_id)
        REFERENCES pacientes(id),

    FOREIGN KEY (dentista_id)
        REFERENCES dentistas(id),

    FOREIGN KEY (procedimento_id)
        REFERENCES procedimentos(id)
);


-- =========================================
-- DADOS INICIAIS
-- =========================================

-- DENTISTAS

INSERT INTO dentistas (nome, especialidade, telefone, email)
VALUES
    ('Dra. Ana Silva', 'Clínico Geral', '11999990001', 'ana@dentalai.com'),
    ('Dr. Carlos Souza', 'Ortodontia', '11999990002', 'carlos@dentalai.com');


-- PACIENTES

INSERT INTO pacientes (nome, telefone, email)
VALUES
    ('Wesley Rebelo', '11988880001', 'wesley@email.com'),
    ('João Santos', '11988880002', 'joao@email.com');


-- PROCEDIMENTOS

INSERT INTO procedimentos (nome, descricao, duracao_minutos, preco)
VALUES
    ('Avaliação', 'Consulta inicial para avaliação odontológica', 30, 150.00),
    ('Limpeza', 'Limpeza e profilaxia dentária', 60, 250.00),
    ('Clareamento', 'Clareamento dentário', 60, 600.00),
    ('Manutenção ortodôntica', 'Manutenção do aparelho ortodôntico', 30, 180.00),
    ('Instalação de aparelho', 'Instalação de aparelho ortodôntico', 90, 800.00);


-- PROCEDIMENTOS REALIZADOS POR CADA DENTISTA

INSERT INTO dentista_procedimentos (dentista_id, procedimento_id)
VALUES
    (1, 1), -- Ana -> Avaliação
    (1, 2), -- Ana -> Limpeza
    (1, 3), -- Ana -> Clareamento

    (2, 1), -- Carlos -> Avaliação
    (2, 2), -- Carlos -> Limpeza
    (2, 4), -- Carlos -> Manutenção ortodôntica
    (2, 5); -- Carlos -> Instalação de aparelho


-- DISPONIBILIDADE

INSERT INTO disponibilidades (
    dentista_id,
    data,
    hora_inicio,
    hora_fim
)
VALUES
    (1, '2026-09-29', '09:00', '12:00'),
    (1, '2026-09-29', '14:00', '18:00'),

    (2, '2026-09-29', '08:00', '12:00'),
    (2, '2026-09-29', '13:00', '17:00');


-- CONSULTA JÁ AGENDADA

INSERT INTO consultas (
    paciente_id,
    dentista_id,
    procedimento_id,
    data_hora_inicio,
    data_hora_fim
)
VALUES (
    1,
    1,
    2,
    '2026-09-29 14:00',
    '2026-09-29 15:00'
);

INSERT INTO consultas (
    paciente_id,
    dentista_id,
    procedimento_id,
    data_hora_inicio,
    data_hora_fim,
    status
)
VALUES
    (2, 2, 2, '2026-09-29 09:00:00', '2026-09-29 10:00:00', 'agendada'),
    (1, 2, 5, '2026-09-29 14:00:00', '2026-09-29 15:30:00', 'agendada');


CREATE TABLE horarios_trabalho (
  id SERIAL PRIMARY KEY,
  dentista_id INTEGER NOT NULL REFERENCES dentistas(id),
  dia_semana INTEGER NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL
);

INSERT INTO horarios_trabalho
    (dentista_id, dia_semana, hora_inicio, hora_fim)
VALUES
    -- Dra. Ana - segunda a sexta
    (1, 1, '08:00', '12:00'),
    (1, 1, '13:00', '17:00'),
    (1, 2, '08:00', '12:00'),
    (1, 2, '13:00', '17:00'),
    (1, 3, '08:00', '12:00'),
    (1, 3, '13:00', '17:00'),
    (1, 4, '08:00', '12:00'),
    (1, 4, '13:00', '17:00'),
    (1, 5, '08:00', '12:00'),
    (1, 5, '13:00', '17:00'),

    -- Dr. Carlos - segunda a sexta
    (2, 1, '08:00', '12:00'),
    (2, 1, '13:00', '17:00'),
    (2, 2, '08:00', '12:00'),
    (2, 2, '13:00', '17:00'),
    (2, 3, '08:00', '12:00'),
    (2, 3, '13:00', '17:00'),
    (2, 4, '08:00', '12:00'),
    (2, 4, '13:00', '17:00'),
    (2, 5, '08:00', '12:00'),
    (2, 5, '13:00', '17:00');


CREATE TABLE excecoes_agenda (
    id SERIAL PRIMARY KEY,
    dentista_id INTEGER NOT NULL REFERENCES dentistas(id),
    data DATE NOT NULL,
    hora_inicio TIME,
    hora_fim TIME,
    tipo VARCHAR(20) NOT NULL,
    descricao VARCHAR(255),

    CHECK (
        (tipo = 'folga' AND hora_inicio IS NULL AND hora_fim IS NULL)
        OR
        (tipo = 'bloqueio' AND hora_inicio IS NOT NULL AND hora_fim IS NOT NULL)
    )
);

INSERT INTO excecoes_agenda
    (dentista_id, data, tipo, descricao)
VALUES
    (1, '2026-10-12', 'folga', 'Nossa Senhora Aparecida'),
    (2, '2026-10-12', 'folga', 'Nossa Senhora Aparecida'),

    (1, '2026-11-02', 'folga', 'Finados'),
    (2, '2026-11-02', 'folga', 'Finados'),

    (1, '2026-11-20', 'folga', 'Dia da Consciência Negra'),
    (2, '2026-11-20', 'folga', 'Dia da Consciência Negra'),

    (1, '2026-12-25', 'folga', 'Natal'),
    (2, '2026-12-25', 'folga', 'Natal');

INSERT INTO excecoes_agenda
    (dentista_id, data, hora_inicio, hora_fim, tipo, descricao)
VALUES
    (2, '2026-10-16', '13:00', '17:00', 'bloqueio', 'Folga à tarde');