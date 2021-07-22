export interface BaseType {
  /**
   * The main identifier
   */
  id: string;

  /**
   * The time that the entity
   * was created
   */
  createdAt: Date;

  /**
   * The last time that the entity
   * was modified
   */
  updatedAt: Date;
}
