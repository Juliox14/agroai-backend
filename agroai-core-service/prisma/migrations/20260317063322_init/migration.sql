-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcela" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Parcela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planta" (
    "id" TEXT NOT NULL,
    "identificador" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha_siembra" TIMESTAMP(3),
    "parcelaId" TEXT NOT NULL,

    CONSTRAINT "Planta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroMultiespectral" (
    "id" TEXT NOT NULL,
    "ndvi_valor" DOUBLE PRECISION NOT NULL,
    "s3_imagen_url" TEXT NOT NULL,
    "datos_extra" JSONB,
    "fecha_captura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plantaId" TEXT NOT NULL,

    CONSTRAINT "RegistroMultiespectral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Parcela" ADD CONSTRAINT "Parcela_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planta" ADD CONSTRAINT "Planta_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "Parcela"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroMultiespectral" ADD CONSTRAINT "RegistroMultiespectral_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Planta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
