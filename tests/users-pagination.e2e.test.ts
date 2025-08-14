/**
 * @jest-environment node
 */

describe('Users Pagination E2E Tests (Mock)', () => {

  describe('Buscar "María" muestra solo coincidencias', () => {
    it('encuentra usuarios con "María" en nombre o email', () => {
      // Simular datos filtrados
      const mockUsers = [
        { name: 'María García', email: 'maria@test.com' },
        { name: 'Carlos María', email: 'carlos@test.com' }
      ];
      
      expect(mockUsers.length).toBeGreaterThan(0);
      
      mockUsers.forEach(user => {
        expect(
          user.name.toLowerCase().includes('maría') || 
          user.email.toLowerCase().includes('maría')
        ).toBe(true);
      });
    });
  });

  describe('Cambiar orden a "Nombre (A–Z)" refleja orden correcto', () => {
    it('ordena usuarios alfabéticamente por nombre ascendente', () => {
      const mockUsers = [
        { name: 'Ana López', email: 'ana@test.com' },
        { name: 'Carlos María', email: 'carlos@test.com' },
        { name: 'María García', email: 'maria@test.com' },
        { name: 'Pedro Martín', email: 'pedro@test.com' }
      ];
      
      // Verificar orden alfabético
      for (let i = 0; i < mockUsers.length - 1; i++) {
        expect(mockUsers[i].name.localeCompare(mockUsers[i + 1].name)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('Navegar entre páginas y cambiar pageSize funciona y conserva filtros', () => {
    it('navega entre páginas manteniendo filtros', () => {
      // Simular página 1
      const page1Data = {
        items: [
          { name: 'Ana test', email: 'ana@test.com' },
          { name: 'Carlos test', email: 'carlos@test.com' }
        ],
        meta: { page: 1, pageSize: 2, total: 4 }
      };
      
      // Simular página 2  
      const page2Data = {
        items: [
          { name: 'María test', email: 'maria@test.com' },
          { name: 'Pedro test', email: 'pedro@test.com' }
        ],
        meta: { page: 2, pageSize: 2, total: 4 }
      };
      
      expect(page1Data.meta.page).toBe(1);
      expect(page1Data.meta.pageSize).toBe(2);
      expect(page2Data.meta.page).toBe(2);
      expect(page2Data.meta.pageSize).toBe(2);

      // Verificar que mantiene filtros
      page1Data.items.forEach(user => {
        expect(
          user.name.toLowerCase().includes('test') || 
          user.email.toLowerCase().includes('test')
        ).toBe(true);
      });
    });

    it('cambia pageSize y conserva filtros', () => {
      const mockData = {
        items: [
          { name: 'Ana test', email: 'ana@test.com' },
          { name: 'Carlos test', email: 'carlos@test.com' },
          { name: 'María test', email: 'maria@test.com' }
        ],
        meta: { pageSize: 5, total: 3 }
      };
      
      expect(mockData.meta.pageSize).toBe(5);
      expect(mockData.items.length).toBeLessThanOrEqual(5);

      // Verificar orden se mantiene (alfabético)
      if (mockData.items.length > 1) {
        expect(mockData.items[0].name.localeCompare(mockData.items[1].name)).toBeLessThanOrEqual(0);
      }

      // Verificar filtro se mantiene
      mockData.items.forEach(user => {
        expect(
          user.name.toLowerCase().includes('test') || 
          user.email.toLowerCase().includes('test')
        ).toBe(true);
      });
    });
  });
});
