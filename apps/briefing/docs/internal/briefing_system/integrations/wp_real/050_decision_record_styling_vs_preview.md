# 🏛️ ADR-001: Decisión Styling vs Preview (Fase 7)

**Título:** Decisión de estrategia para conmutación a WordPress Real: Styling primero vs Preview primero  
**Status:** 🟡 **PROPOSED** (en evaluación)  
**Fecha:** 2025-10-20  
**Responsables:** Copilot (análisis), Owner (decisión final)

---

## 📌 Contexto

Tras completar la preparación de la Fase 7 (workflows enriquecidos, documentación, credenciales listas), se requiere decidir la estrategia de transición del modo placeholder a WordPress real (runalfondry.com).

**Preguntas clave:**
1. ¿Hacemos ajustes de aspecto/tema ANTES de validar credenciales?
2. ¿Creamos un entorno de staging/preview para minimizar riesgos?
3. ¿Ejecutamos ambas en paralelo de forma coordinada?

**Impacto:**
- Duración del proyecto Fase 7 (~1-2 semanas)
- Riesgo de exposición de datos reales
- Calidad del sitio visible al público
- Estabilidad de los workflows

---

## 🎯 Opciones Evaluadas

### **OPCIÓN 1: Styling Primero**

**Descripción:**
Aplicar ajustes de tema, menús, estructura de página, y hardening UI ANTES de activar los workflows `verify-*` con credenciales reales.

**Flujo:**
```
1. Owner carga credenciales en GitHub (WP_BASE_URL, WP_USER, WP_APP_PASSWORD)
2. Copilot ejecuta verify-home manual: Auth=OK ✓
3. Owner identifica cambios de tema necesarios (menús, colores, home, etc.)
4. Owner aplica cambios EN STAGING (subdominio/entorno local)
5. Owner valida cambios en staging
6. Owner replica cambios a PRODUCCIÓN
7. Ejecutar verify-* en producción: Compliance OK ✓
8. Adjuntar artifacts en Issue #50
```

**Duración estimada:** ~1 semana

**Ventajas:**
- ✅ Aspecto del sitio pulido ANTES de exponerlo
- ✅ Menor riesgo de inconsistencias visuales
- ✅ Cambios controlados en staging primero
- ✅ Público ve sitio "completo"

**Desventajas:**
- ❌ Requiere entorno staging operativo
- ❌ Cambios manuales de tema (más labor)
- ❌ Posible de-sincronización prod/staging
- ❌ Más tiempo hasta validación técnica

**Riesgos:**
- 🔴 Cambios de tema pueden romper funcionalidad
- 🟡 Staging no refleja exactamente producción

---

### **OPCIÓN 2: Preview Primero (Recomendado para Fase 7)**

**Descripción:**
Crear un entorno de staging/preview (subdominio o máquina espejo) para validar TODOS los workflows `verify-*` con credenciales reales, minimizando riesgos sobre producción. Luego, solo cambios críticos en prod.

**Flujo:**
```
1. Owner carga credenciales EN GITHUB PERO apuntando a staging
   (WP_BASE_URL = https://staging.runalfondry.com O subdominio preview)
2. Habilitar entorno staging (copia de BD + archivos de prod)
3. Copilot ejecuta verify-* en Actions contra staging
4. Verificar todos los workflows: Auth=OK, Compliance OK ✓
5. Adjuntar artifacts de staging en Issue #50
6. Owner realiza solo ajustes CRÍTICOS en prod (si aplica)
7. Owner cambia WP_BASE_URL en GitHub a prod
8. Ejecutar verify-* en prod: Auth=OK ✓
9. Adjuntar artifacts finales en Issue #50
```

**Duración estimada:** ~2 semanas (incluida setup de staging)

**Ventajas:**
- ✅ **Riesgo MÍNIMO sobre producción**
- ✅ Valida workflows sin tocar prod
- ✅ Staging es entorno "seguro" para pruebas
- ✅ Si falla algo, prod no se ve afectado
- ✅ Menos labor manual (solo changes técnicos críticos)

**Desventajas:**
- ❌ Requiere setup de staging (tiempo inicial)
- ❌ Costo de servidor adicional (posiblemente)
- ❌ Más pasos, más complejidad

**Riesgos:**
- 🟡 Staging podría diferir de prod (datos outdated)
- 🟡 Mayor complejidad inicial

---

### **OPCIÓN 3: Mixto (Paralelo Coordinado)**

**Descripción:**
Ejecutar ambas estrategias en paralelo: staging para validación técnica + cambios críticos de tema simultáneamente en producción (con precaución).

**Flujo:**
```
1. Owner carga credenciales (staging + prod)
2. Habilitar staging (copy de BD + archivos)
3. Ejecutar verify-* EN STAGING (background, auditoría técnica)
4. Owner aplica SOLO cambios críticos de tema en PROD (minimal risk items)
   ├─ Cambios críticos: menús principales, home, estructura
   ├─ Cambios secundarios: colores, tipografía (aplazar)
5. Verificar workflows en staging: Auth=OK ✓
6. Ejecutar verify-* en PROD: Auth=OK ✓
7. Adjuntar artifacts de ambos en Issue #50
```

**Duración estimada:** ~1.5 semanas

**Ventajas:**
- ✅ Valida técnicamente en sandbox (staging)
- ✅ Aplica cambios críticos rápido
- ✅ Balance entre velocidad y riesgo

**Desventajas:**
- ❌ Requiere coordinación precisa
- ❌ Riesgo moderado en prod
- ❌ Posible inconsistencia temporal

**Riesgos:**
- 🔴 Si cambios críticos fallan en prod, puede afectar usuarios
- 🟡 Requiere equipo coordinado

---

## 🎯 Matriz Comparativa

| Criterio | Styling Primero | Preview Primero | Mixto |
|----------|----------------|-----------------|-------|
| **Duración** | ~1 semana | ~2 semanas | ~1.5 semanas |
| **Riesgo en prod** | 🟡 Medio | 🟢 Bajo | 🟡 Medio |
| **Complejidad** | 🟢 Baja | 🟡 Media | 🟡 Media |
| **Aspecto final** | 🟢 Pulido | 🟡 Mínimo pulido | 🟡 Parcialmente pulido |
| **Recomendado para Fase 7** | ❌ No | ✅ **SÍ** | ⚠️ Opcional |

---

## 🚨 Semáforo de Riesgo por Opción

### Opción 1: Styling Primero
```
SEVERIDAD DE RIESGOS:
🔴 Muy Alto    :  Cambios theme rompen funcionalidad
🟡 Medio        : Staging no refleja prod exactamente
🟢 Bajo         : Cambios NO exponen credenciales
```

**Calificación:** ⚠️ RIESGO MEDIO-ALTO

---

### Opción 2: Preview Primero ← **RECOMENDADA**
```
SEVERIDAD DE RIESGOS:
🔴 Muy Alto    :  (Ninguno identificado sobre prod)
🟡 Medio        : Staging setup inicial consume tiempo
🟢 Bajo         : Cambios técnicos mínimos
```

**Calificación:** ✅ RIESGO BAJO (SEGURA)

---

### Opción 3: Mixto
```
SEVERIDAD DE RIESGOS:
🔴 Muy Alto    :  Cambios críticos simultáneos en prod
🟡 Medio        : Requiere coordinación perfecta
🟢 Bajo         : Valida técnicamente en sandbox
```

**Calificación:** ⚠️ RIESGO MEDIO

---

## 📊 Criterios de Aceptación (Independiente de Opción)

Toda opción elegida debe cumplir:

### Técnico
- [ ] `verify-home`: `Auth=OK; mode=real; FrontES/EN=200`
- [ ] `verify-settings`: `mode=real; Compliance=OK`
- [ ] `verify-menus`: `mode=real; Compliance=No` (ó indeterminado si no hay plugin)
- [ ] `verify-media`: `mode=real; MISSING=0`

### Seguridad
- [ ] NO hay credenciales en git/logs
- [ ] GitHub Secrets enmascarados en artifacts
- [ ] NO hay wp-config.php versionado
- [ ] Backups de BD antes de cambios

### Documentación
- [ ] Artifacts de todos los workflows adjuntos en Issue #50
- [ ] Decisión registrada en este ADR (final)
- [ ] Cambios de tema (si aplica) documentados en CHANGELOG.md

---

## 💡 Recomendación

**🟢 PROPONER: OPCIÓN 2 — Preview Primero**

**Justificación:**
1. **Riesgo MÍNIMO:** No toca producción hasta validar técnicamente
2. **Fase 7 es crítica:** Primera exposición de credenciales reales; mejor ser conservadores
3. **Workflows son código:** Se valida el código contra sitio real sin riesgo
4. **Duración razonable:** 2 semanas es aceptable para transición segura
5. **Precedente:** Seguir buenas prácticas (Staging → Prod)

**Siguiente paso:**
- Owner valida esta recomendación
- Si aprueeba → Proceder a habilitar staging
- Si rechaza → Evaluar Opción 1 (Styling primero) o Opción 3 (Mixto)

---

## 🎯 Next Steps (Por Opción)

### Si se elige Opción 2 (Preview Primero) ✅
1. [ ] Owner habilita subdominio/staging (ej: `staging.runalfondry.com`)
2. [ ] Owner copia BD + archivos de prod a staging
3. [ ] Owner carga `WP_BASE_URL` = staging en GitHub (temporalmente)
4. [ ] Copilot ejecuta `verify-home` en Actions (contra staging)
5. [ ] Si Auth=OK → Proceder con `verify-settings`, `verify-menus`, `verify-media`
6. [ ] Adjuntar artifacts en Issue #50
7. [ ] Owner cambia `WP_BASE_URL` a producción
8. [ ] Ejecutar workflows en prod (validación final)
9. [ ] ✅ Fase 7 Completada

### Si se elige Opción 1 (Styling Primero) ⚠️
1. [ ] Owner carga credenciales (prod)
2. [ ] Copilot ejecuta verify-home manual
3. [ ] Owner identifica cambios de tema necesarios
4. [ ] Owner aplica cambios en staging
5. [ ] Owner valida y replica a prod
6. [ ] Ejecutar verify-* en prod
7. [ ] ✅ Fase 7 Completada (más labor manual)

### Si se elige Opción 3 (Mixto) ⚠️
1. [ ] Owner habilita staging
2. [ ] Owner copia BD + archivos
3. [ ] Owner carga credenciales (staging + prod)
4. [ ] Owner aplica cambios críticos EN PROD
5. [ ] Copilot ejecuta verify-* EN STAGING + PROD
6. [ ] Adjuntar artifacts de ambos
7. [ ] ✅ Fase 7 Completada (riesgo medio)

---

## 📋 Decisión Final (A COMPLETAR POR OWNER)

**Estado:** 🟡 PENDING OWNER DECISION

### Owner confirma:
- [ ] **Opción 1 — Styling Primero**
- [ ] **Opción 2 — Preview Primero** (RECOMENDADA)
- [ ] **Opción 3 — Mixto (Paralelo)**

**Decisión tomada por:** __________ **Fecha:** __________

**Justificación especial (si aplica):**
```
[Owner puede escribir aquí razones para elegir una opción u otra]
```

---

## 🔗 Referencias

- Documento central: `000_state_snapshot_checklist.md`
- README: `README.md` (en esta carpeta)
- Issue #50: `issues/Issue_50_Fase7_Conexion_WordPress_Real.md`

---

**Estado:** 🟡 PROPOSED (Esperando decisión del owner)  
**Próxima revisión:** Tras feedback del owner  
**Última actualización:** 2025-10-20
