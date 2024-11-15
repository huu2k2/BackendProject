/*
  Warnings:

  - You are about to drop the column `order_id` on the `order_merges` table. All the data in the column will be lost.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order_merges` DROP FOREIGN KEY `order_merges_order_id_fkey`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `type` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order_merges` DROP COLUMN `order_id`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `order_merge_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `status` ENUM('WAIT', 'FINISH') NOT NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_order_merge_id_fkey` FOREIGN KEY (`order_merge_id`) REFERENCES `order_merges`(`order_merge_id`) ON DELETE SET NULL ON UPDATE CASCADE;
