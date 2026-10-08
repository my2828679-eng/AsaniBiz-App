/**
 * AsaniBiz AI Munshi Session Context
 * 
 * Manages conversation history, entity focus (last mentioned customer, product, bill),
 * and multi-step voice command state scoped to current business session.
 */

export interface ActiveConversationEntity {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  productId?: string;
  productName?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  lastAmount?: number;
  lastIntent?: string;
  updatedAt: number;
}

export interface ConversationSessionContext {
  activeEntity: ActiveConversationEntity;
  activeView: string;
  pendingClarification?: {
    type: 'disambiguate_customer' | 'disambiguate_product' | 'missing_amount' | 'general';
    candidates?: Array<{ id: string; name: string; details?: string }>;
    originalCommand: string;
    targetIntent: string;
  };
  lastProposals: Array<{
    id: string;
    type: string;
    createdAt: number;
    status: 'pending' | 'confirmed' | 'cancelled';
  }>;
}

class AIMunshiContextStore {
  private sessions = new Map<string, ConversationSessionContext>();

  private getSessionKey(businessId: string): string {
    return businessId || 'biz_default';
  }

  public getSession(businessId: string): ConversationSessionContext {
    const key = this.getSessionKey(businessId);
    let session = this.sessions.get(key);
    if (!session) {
      session = {
        activeEntity: {
          updatedAt: Date.now(),
        },
        activeView: 'billing',
        lastProposals: [],
      };
      this.sessions.set(key, session);
    }
    return session;
  }

  public updateActiveEntity(businessId: string, partial: Partial<ActiveConversationEntity>): void {
    const session = this.getSession(businessId);
    session.activeEntity = {
      ...session.activeEntity,
      ...partial,
      updatedAt: Date.now(),
    };
  }

  public setPendingClarification(businessId: string, clarification: ConversationSessionContext['pendingClarification']): void {
    const session = this.getSession(businessId);
    session.pendingClarification = clarification;
  }

  public clearPendingClarification(businessId: string): void {
    const session = this.getSession(businessId);
    session.pendingClarification = undefined;
  }

  public getActiveCustomer(businessId: string): { id?: string; name?: string; phone?: string } | null {
    const session = this.getSession(businessId);
    if (session.activeEntity.customerId || session.activeEntity.customerName) {
      // 10 minute context validity window
      if (Date.now() - session.activeEntity.updatedAt < 10 * 60 * 1000) {
        return {
          id: session.activeEntity.customerId,
          name: session.activeEntity.customerName,
          phone: session.activeEntity.customerPhone,
        };
      }
    }
    return null;
  }

  public getActiveProduct(businessId: string): { id?: string; name?: string } | null {
    const session = this.getSession(businessId);
    if (session.activeEntity.productId || session.activeEntity.productName) {
      if (Date.now() - session.activeEntity.updatedAt < 10 * 60 * 1000) {
        return {
          id: session.activeEntity.productId,
          name: session.activeEntity.productName,
        };
      }
    }
    return null;
  }

  public resetSession(businessId: string): void {
    const key = this.getSessionKey(businessId);
    this.sessions.delete(key);
  }
}

export const aiMunshiSessionStore = new AIMunshiContextStore();
